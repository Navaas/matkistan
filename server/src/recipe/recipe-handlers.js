import express from "express";
import { RecipeModel } from "./recipe-model.js";

const recipeRouter = express.Router();

// Funktion för att hämta alla recept
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await RecipeModel.find(); // Använd RecipeModel

    if (!recipes || recipes.length === 0) {
      console.log("Inga recept hittades.");
      return res.status(404).json({ message: "No recipes found" });
    }

    console.log("Recept från databasen:", JSON.stringify(recipes, null, 2));
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Error fetching recipes" });
  }
};

// recipeRouter.post("/", async (req, res) => {
//   console.log("POST /recipes hit with body:", req.body); // Loggar inkommande data
//   const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
//     req.body;

//   try {
//     const newRecipe = new Recipe({
//       title,
//       ingredients,
//       steps,
//       difficulty,
//       cookingTime,
//       imageUrl, // Här sparas bildens ID
//     });

//     await newRecipe.save();
//     res.status(201).json(newRecipe);
//   } catch (error) {
//     console.error("Error creating recipe:", error);
//     res.status(500).json({ message: "Failed to create recipe" });
//   }
// });

export const createNewRecipe = async (recipeData) => {
  const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
    recipeData;

  const newRecipe = new RecipeModel({
    title,
    ingredients,
    steps,
    difficulty,
    cookingTime,
    imageUrl,
  });

  await newRecipe.save(); // Spara receptet
  return newRecipe;
};

// export const createRecipesWithImage = async (req, res) => {
//   try {
//     console.log("Inkommande data:", req.body);
//     const recipeData = req.body;
//     const newRecipe = await createNewRecipe(recipeData); // Använd createNewRecipe
//     res.status(201).json(newRecipe);
//   } catch (error) {
//     console.error("Error creating recipe:", error);
//     res.status(500).json({ message: "Failed to create recipe" });
//   }
// };

export const createRecipesWithImage = async (req, res) => {
  try {
    const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
      req.body;
    console.log("Inkommande data:", req.body);
    // Skapa en ny post i databasen
    const newRecipe = new RecipeModel({
      title,
      ingredients,
      steps,
      difficulty,
      cookingTime,
      imageUrl, // Lägg till bildens URL eller ID
    });

    await newRecipe.save(); // Spara receptet
    res.status(201).json(newRecipe); // Skicka tillbaka det nyskapade receptet som svar
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export default recipeRouter;
