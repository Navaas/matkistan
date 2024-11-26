import express from "express";
import {
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
} from "./user-handlers.js";

const userRouter = express.Router();

userRouter.get("/users", getUsers);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

export default userRouter;
