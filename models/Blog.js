
const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true,
            minlength: 4
        },
        desc: {
            type: String,
            required: true,
            minlength: 12
        },
        photo: {
            type: String,
            required: true
        },
        categories: {
            type: [String],
            default: []
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
