import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { createCategories } from "./src/category/category-handlers.js";
import categoryRouter from "./src/category/category-router.js";
import imagesRouter from "./src/images/images-router.js";
import recipeRouter from "./src/recipe/recipe-router.js";
import userRouter from "./src/user/user-router.js";

const app = express();
createCategories();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://matkistan.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
dotenv.config();

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token saknas" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Ogiltig token" });
    }
    req.user = user;
    next();
  });
};

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Välkommen till den skyddade resursen", user: req.user });
});

// app.use(
//   cookieSession({
//     name: "login",
//     secret: process.env.COOKIE_SECRET,
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//     httpOnly: true,
//     secure: false,
//     sameSite: "lax",
//   })
// );

app.use("/", userRouter);
app.use("/", recipeRouter);
app.use("/images", imagesRouter);
app.use("/categories", categoryRouter);

export default app;
