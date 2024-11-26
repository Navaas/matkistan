import cookieSession from "cookie-session";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import imagesRouter from "./src/images/images-router.js";
import recipeRouter from "./src/recipe/recipe-router.js";
import userRouter from "./src/user/user-router.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
dotenv.config();
app.use(
  cookieSession({
    name: "login",
    secret: process.env.COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: false,
  })
);

app.use("/", userRouter);
app.use("/", recipeRouter);
app.use("/images", imagesRouter);

export default app;
