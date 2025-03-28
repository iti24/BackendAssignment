const Post = require("../models/post");

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({ title, content, author: req.user.id });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getAllPosts = async (req, res) => {
    try {
      const userId = req.user.id;
      console.log("userid",userId) // Extract user ID from token (middleware should add this)
      
      const posts = await Post.find({ author: userId }).populate("author", "name email");
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  exports.getPostById = async (req, res) => {
    try {
      const userId = req.user.id; // Extract user ID from token (middleware should set this)
      const post = await Post.findOne({ _id: req.params.id, author: userId }).populate("author", "name email");
  
      if (!post) return res.status(404).json({ message: "Post not found or access denied" });
  
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  



exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.title = title;
    post.content = content;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deletePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
