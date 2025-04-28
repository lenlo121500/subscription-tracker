import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";
import authorize, { authorizeRoles } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", authorize, authorizeRoles("admin"), getAllUsers);

userRouter.get("/:id", authorize, getUser);

userRouter.put("/:id", authorize, authorizeRoles("admin"), updateUser);

userRouter.delete("/:id", authorize, authorizeRoles("admin"), deleteUser);

export default userRouter;
