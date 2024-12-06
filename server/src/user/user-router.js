import express from "express";
import { isLoggedIn } from "../../middlewares.js";
import {
  deleteUser,
  getLoggedInUser,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "./user-handlers.js";

const userRouter = express.Router();

userRouter.get("/users", getUsers);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.delete("/deleteUser/:id", deleteUser);
userRouter.put("/updateUser/:id", isLoggedIn, updateUser);
userRouter.get("/auth", isLoggedIn, getLoggedInUser);

export default userRouter;
