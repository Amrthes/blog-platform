
const authRouter = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authRouter.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                msg: "Username, email and password are required"
            });
        }

        const existing = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existing) {
            return res.status(409).json({
                msg: "Username or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            msg: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (
            !user ||
            !(await bcrypt.compare(password || "", user.password))
        ) {
            return res.status(401).json({
                msg: "Invalid credentials"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                msg: "JWT_SECRET is missing in .env"
            });
        }

        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

module.exports = authRouter;
