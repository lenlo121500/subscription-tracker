import Subscription from "../models/subscription.model.js";
import logger from "../utils/logger.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  logger.info("Create subscription controller endpoint hit...");
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "Content-Type": "application/json",
      },
      retries: 0,
    });
    res.status(201).json({
      success: true,
      data: {
        subscription,
        workflowRunId,
      },
    });
  } catch (error) {
    logger.error(`Error creating subscription: ${error}`);
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  logger.info("Get user subscriptions controller endpoint hit...");
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error(
        "Unauthorized - You cannot get subscriptions for another user"
      );
      error.statusCode = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    logger.error(`Error getting user subscriptions: ${error}`);
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  logger.info("Delete subscription controller endpoint hit...");
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    // check if the logged-in user is the owner of the subscription
    if (req.user.id !== subscription.user.toString()) {
      const error = new Error(
        "Unauthorized - You cannot delete this subscription"
      );
      error.statusCode = 401;
      throw error;
    }

    await subscription.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    logger.error(`Error deleting subscription: ${error}`);
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  logger.info("Cancel subscription controller endpoint hit...");
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    // check if the logged-in user is the owner of the subscription
    if (req.user.id !== subscription.user.toString()) {
      const error = new Error(
        "Unauthorized - You cannot cancel this subscription"
      );
      error.statusCode = 401;
      throw error;
    }

    subscription.status = "cancelled";
    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      data: subscription,
    });
  } catch (error) {
    logger.error(`Error cancelling subscription: ${error}`);
    next(error);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  logger.info("Get upcoming renewals controller endpoint hit...");
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30);

    const subscriptions = await Subscription.find({
      renewalDate: { $gte: today, $lte: futureDate },
      status: "active",
    }).populate("user", "name email");

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    logger.error(`Error getting upcoming renewals: ${error}`);
    next(error);
  }
};
