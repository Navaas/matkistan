import express from "express";
import { getUsers, registerUser } from "./user-handlers.js";

const userRouter = express.Router();

userRouter.get("/users", getUsers);
userRouter.post("/register", registerUser);

export default userRouter;
