const blogRouter = require("express").Router();
const Blog = require("../models/Blog");
const verifyToken = require("../middlewares/verifyToken");

// Get all blogs
blogRouter.get("/getAll", async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Create a blog
blogRouter.post("/create", verifyToken, async (req, res) => {
    try {
        const blog = await Blog.create({
            ...req.body,
            userId: req.user.id
        });

        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Get a blog using its ID
blogRouter.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                msg: "Blog not found"
            });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Update a blog
blogRouter.put("/updateBlog/:id", verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                msg: "Blog not found"
            });
        }

        if (blog.userId.toString() !== req.user.id) {
            return res.status(403).json({
                msg: "You can update only your own posts"
            });
        }

        Object.assign(blog, req.body);
        blog.userId = req.user.id;

        const updatedBlog = await blog.save();
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Delete a blog
blogRouter.delete("/deleteBlog/:id", verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                msg: "Blog not found"
            });
        }

        if (blog.userId.toString() !== req.user.id) {
            return res.status(403).json({
                msg: "You can delete only your own posts"
            });
        }

        await blog.deleteOne();

        res.status(200).json({
            msg: "Blog deleted successfully"
        });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = blogRouter;
