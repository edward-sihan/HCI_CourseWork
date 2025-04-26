const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//register User
const registerUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;

    //check if user already exist in database
    const checkExistingUser = await User.findOne({
      $or: [{ userName }, { email }],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: `User with ${userName} and ${email} exist, Please log-in`,
      });
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new User and save in mongoDB
    const newlyCreatedUser = new User({
      userName: userName,
      email: email,
      password: hashedPassword,
      role: role || "user",
    });

    await newlyCreatedUser.save();

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User registered Successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user please try again",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

//Login User
const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    //find if the current user is exists in the database or not
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesnt exist please register user first",
      });
    }

    //check if the passowrd is correct or not
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password please try again ",
      });
    }

    //create user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        userName: user.userName,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "60m",
      }
    );

    //return the token
    res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

module.exports = { registerUser, loginUser };
