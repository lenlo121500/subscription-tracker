import { Router } from "express";
import authorize, { authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  cancelSubscription,
  createSubscription,
  deleteSubscription,
  getUpcomingRenewals,
  getUserSubscriptions,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.send("Get all subscriptions");
});

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.delete("/:id", authorize, deleteSubscription);

subscriptionRouter.put("/cancel/:id", authorize, cancelSubscription);

subscriptionRouter.get(
  "/upcoming-renewals",
  authorize,
  authorizeRoles("admin"),
  getUpcomingRenewals
);

export default subscriptionRouter;
