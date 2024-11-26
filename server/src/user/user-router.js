import express from "express";
import {
  deleteUser,
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
userRouter.delete("/:id", deleteUser);

export default userRouter;
