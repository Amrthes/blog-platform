
const userRouter = require("express").Router();
const User = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");

userRouter.get("/find/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({ msg: "No such user" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

userRouter.get("/findAll", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

userRouter.delete(
    "/deleteUser/:userId",
    verifyToken,
    async (req, res) => {
        try {
            if (req.params.userId !== req.user.id) {
                return res.status(403).json({
                    msg: "You can delete only your own profile"
                });
            }

            const user = await User.findByIdAndDelete(
                req.params.userId
            );

            if (!user) {
                return res.status(404).json({
                    msg: "User not found"
                });
            }

            res.status(200).json({
                msg: "Successfully deleted"
            });
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
);

module.exports = userRouter;
