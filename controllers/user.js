const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");

exports.register = async (req, res) => {
    try {
      console.log("req.body", req.body);
      
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      let user = await User.findOne({ email });
      console.log("user", user);
      if (user) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ name, email, password: hashedPassword });
  
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, config.jwtSecret, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
