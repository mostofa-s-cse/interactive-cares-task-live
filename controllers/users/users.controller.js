const db = require("../../models");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../utils/jwt_token");
const { ErrorLogger } = require("../../utils/logger");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = db.user;

// User signup
module.exports.signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide first name, last name, email, and password",
      });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(403).send({
        status: "fail",
        message: "User already exists",
      });
    }

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password,
      role: "user",
    });

    const token = generateToken(newUser);
    res.status(200).send({
      status: "success",
      message: "Account created successfully",
      data: newUser,
      token,
    });
  } catch (error) {
    res.status(400).send({
      status: "fail",
      message: "Failed to create account",
      error: error.message,
    });
    ErrorLogger.error("user create" + " " + error.message);
  }
};

// Get all users
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    if (!users || users.length === 0) {
      return res.status(404).send({
        status: "fail",
        message: "No users found",
      });
    }

    const userData = users.map(user => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    }));

    res.status(200).send({
      status: "success",
      message: "Retrieved all users",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Get single user
module.exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).send({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).send({
      status: "success",
      message: "Retrieved user information",
      data: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// User login
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);
    res.cookie('token', token, { maxAge: 28800000, secure: true }).status(200).send({
      status: "success",
      message: "Logged in successfully",
      data: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    ErrorLogger.error(error.message);
    next(error.message);
  }
};

// Update user information
module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, password, role } = req.body;

    if (!first_name || !email) {
      return res.status(400).json({
        status: "fail",
        message: "First name and email are required fields",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update(
      { first_name, last_name, email, password: hashedPassword, role },
      { where: { id } }
    );

    res.status(200).json({
      status: "success",
      message: "User information updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to update user information",
      error: error.message,
    });
    ErrorLogger.error("updateUserInformation" + " " + error.message);
  }
};

// Delete user
module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "User ID is required",
      });
    }

    const result = await User.destroy({ where: { id } });

    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
