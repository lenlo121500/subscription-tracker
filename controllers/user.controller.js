import User from "../models/user.model.js";
import logger from "../utils/logger.js";

export const getAllUsers = async (req, res, next) => {
  logger.info("Get all users controller endpoint hit...");
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      const error = new Error("No users found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    logger.error("Error getting all users:", error);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  logger.info("Get user controller endpoint hit...");
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error("Error getting user:", error);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  logger.info("Update user controller endpoint hit...");
  try {
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      const error = new Error(
        "Unauthorized - You're not authorized to perform this action"
      );
      error.statusCode = 403;
      throw error;
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error("Error updating user:", error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  logger.info("Delete user controller endpoint hit...");
  try {
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      const error = new Error(
        "Unauthorized - You're not authorized to perform this action"
      );
      error.statusCode = 403;
      throw error;
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting user:", error);
    next(error);
  }
};
