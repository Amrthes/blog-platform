
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");

console.log("Blog backend is starting...");

dotenv.config();

console.log(
    "MongoDB URL loaded:",
    Boolean(process.env.MONGO_URL)
);

const authRouter = require("./controllers/auth");
const blogRouter = require("./controllers/blog");
const userRouter = require("./controllers/user");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/blog", blogRouter);
app.use("/user", userRouter);
app.use("/images", express.static("public/images"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
    res.status(200).json({
        msg: "Successfully uploaded"
    });
});

async function startServer() {
    try {
        console.log("Connecting to MongoDB...");

        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is missing in .env");
        }

        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("DB is successfully connected");

        app.listen(5000, () => {
            console.log(
                "Server is connected successfully at http://localhost:5000"
            );
        });
    } catch (error) {
        console.error("Startup failed:", error.message);
        process.exitCode = 1;
    }
}

startServer();
