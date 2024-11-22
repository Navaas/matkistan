import busboy from "busboy";
import mongoose from "mongoose";
import sharp from "sharp";
import { recipeSchema } from "../recipe/recipe-model.js";
import { getImageBucket } from "./images-model.js";

// Hämta en bild från GridFS
const getImage = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(`${req.params.id}`);
    const imageBucket = getImageBucket();

    const imageData = await imageBucket.find({ _id: id }).next();

    if (!imageData) {
      return res.status(404).json("Image does not exist");
    }

    res.setHeader("Content-Type", imageData.metadata?.contentType);
    imageBucket.openDownloadStream(imageData._id).pipe(res);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Failed to fetch image" });
  }
};

const uploadImage = (req, res) => {
  const bb = busboy({ headers: req.headers });
  req.pipe(bb);
  bb.on("file", (_, incomingStream, info) => {
    const uploadStream = getImageBucket().openUploadStream(info.filename, {
      metadata: {
        contentType: info.mimeType,
      },
    });

    uploadStream.on("finish", () => {
      res
        .status(201)
        .json({ url: `http://localhost:3000/images/${uploadStream.id}` });
    });

    uploadStream.on("error", (error) => {
      console.error("Error saving image to GridFS:", error);
      res.status(500).json({ message: "Failed to save image" });
    });

    const transformer = sharp().resize({
      width: 100,
      height: 100,
      fit: "cover",
    });

    transformer.on("error", (error) => {
      console.error("Error processing image:", error);
      res.status(500).json({ message: "Failed to process image" });
    });
    incomingStream.pipe(transformer).pipe(uploadStream);
  });

  bb.on("error", (error) => {
    console.error("Error in file upload:", error);
    res.status(500).json({ message: "Failed to upload image" });
  });
};

// Skapa ett nytt inlägg med bild
const createRecipesWithImage = async (req, res) => {
  try {
    const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
      req.body;

    // Skapa en ny post i databasen
    const newRecipe = new recipeSchema({
      title,
      ingredients,
      steps,
      difficulty,
      cookingTime,
      imageUrl, // Lägg till bildens URL eller ID
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export { createRecipesWithImage, getImage, uploadImage };
