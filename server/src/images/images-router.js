import express from "express";
import { getImage, uploadImage } from "./images-handlers.js";

const imagesRouter = express.Router();

imagesRouter.get("/:id", getImage);
imagesRouter.post("/", uploadImage);

export default imagesRouter;
