import express from "express";
import { getUsers, loginUser, registerUser } from "./user-handlers.js";

const userRouter = express.Router();

userRouter.get("/users", getUsers);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
