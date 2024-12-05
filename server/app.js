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
app.use(express.json());
dotenv.config();
// app.use(
//   cookieSession({
//     name: "login",
//     secret: process.env.COOKIE_SECRET,
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//     httpOnly: true,
//     resave: false,
//     secure: false,
//     sameSite: "lax",
//     cookie: {
//       httpOnly: true, // Skydda cookies från att nås via JS
//       secure: false, // Sätt till true om du använder HTTPS
//     },
//   })
// );
app.use(
  cookieSession({
    name: "login",
    secret: process.env.COOKIE_SECRET, // Din hemliga nyckel
    maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie varaktighet (1 vecka)
    httpOnly: true, // Skydda cookies från att nås via JS
    secure: true, // Sätt till true om du kör HTTPS
    sameSite: "lax", // Tillåt cookies att användas i cross-site request
    cookie: {
      httpOnly: true, // Skydda cookies från att nås via JS
      secure: process.env.NODE_ENV === "production", // Sätt till true om HTTPS
    },
  })
);

app.use("/", userRouter);
app.use("/", recipeRouter);
app.use("/images", imagesRouter);
app.use("/categories", categoryRouter);

export default app;
