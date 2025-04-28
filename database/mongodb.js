import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV } from "../config/env.js";
import logger from "../utils/logger.js";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.<development/production>.local"
  );
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info(`Connected to MongoDB in ${NODE_ENV} mode`);
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
