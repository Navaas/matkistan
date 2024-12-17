import cookieSession from "cookie-session";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createCategories } from "./src/category/category-handlers.js";
import categoryRouter from "./src/category/category-router.js";
import imagesRouter from "./src/images/images-router.js";
import recipeRouter from "./src/recipe/recipe-router.js";
import userRouter from "./src/user/user-router.js";

const app = express();
createCategories();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors({ origin: "https://matkistan.vercel.app/", credentials: true }));

app.use(express.json());
dotenv.config();
app.use(
  cookieSession({
    name: "login",
    secret: process.env.COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  })
);

app.use("/", userRouter);
app.use("/", recipeRouter);
app.use("/images", imagesRouter);
app.use("/categories", categoryRouter);

app.use("/test"),
  (req, res) => {
    res.send("Hello from test!");
  };

export default app;
