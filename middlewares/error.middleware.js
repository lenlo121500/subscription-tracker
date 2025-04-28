import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    logger.error(error);

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new Error(message);
      error.status = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.status = 400;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((item) => item.message);

      error = new Error(message.join(", "));
      error.status = 400;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      error: "Internal Server Error",
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
