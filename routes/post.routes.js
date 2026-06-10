const express = require("express");
const router = express.Router();
const multer = require("multer");
const ImageKit = require("@imagekit/nodejs");

const Post = require("../models/post.models.js");
const User = require("../models/user.model.js");
const IdentifyUser  = require("../middlewares/post.middleware.js");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT
});

const upload = multer({
    storage: multer.memoryStorage()
});


router.post(
    "/post",
    IdentifyUser,
    upload.single("img"),
    async (req, res) => {
        try {
            const { caption } = req.body;
            const userId = req.user.id;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    message: "Image is required"
                });
            }

            const uploadedFile = await imagekit.upload({
                file: req.file.buffer,
                fileName: req.file.originalname,
                folder: "InstaProject"
            });

            const newPost = new Post({
                caption,
                img_url: uploadedFile.url,
                user_id: {
                    _id: user._id,
                    username: user.username
                }
            });

            const savedPost = await newPost.save();

            res.status(201).json(savedPost);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: error.message
            });
        }
    }
);


router.get("/posts", IdentifyUser, async (req, res) => {
    try {
        const posts = await Post.find({
            "user_id._id": req.user.id
        });

        res.status(200).json(posts);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
});


router.get("/posts/:postId", IdentifyUser, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json(post);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;