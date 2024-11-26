import express from "express";
import UserModel from "../user/user-model.js";
import { RecipeModel } from "./recipe-model.js";

const recipeRouter = express.Router();

/* Get all recipes */
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await RecipeModel.find();

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

/* Create new recipes */
// export const createNewRecipe = async (recipeData) => {
//   const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
//     recipeData;

//   const newRecipe = new RecipeModel({
//     title,
//     ingredients,
//     steps,
//     difficulty,
//     cookingTime,
//     imageUrl,
//   });

//   await newRecipe.save();
//   return newRecipe;
// };
export const createNewRecipe = async (recipeData, userId) => {
  const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
    recipeData;

  try {
    // Skapa ett nytt recept och koppla det till användaren
    const newRecipe = new RecipeModel({
      title,
      ingredients,
      steps,
      difficulty,
      cookingTime,
      imageUrl,
      createdBy: userId, // Koppla receptet till den inloggade användaren
    });

    // Spara receptet i databasen
    await newRecipe.save();

    // Lägg till receptet i användarens 'recipesCreated'-array
    await UserModel.findByIdAndUpdate(userId, {
      $push: { recipesCreated: newRecipe._id },
    });

    return newRecipe; // Returnera det skapade receptet
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw new Error("Kunde inte skapa receptet");
  }
};

// /* Create new recipes with image */
// export const createRecipesWithImage = async (req, res) => {
//   try {
//     const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
//       req.body;
//     console.log("Inkommande data:", req.body);

//     const newRecipe = new RecipeModel({
//       title,
//       ingredients,
//       steps,
//       difficulty,
//       cookingTime,
//       imageUrl, // Lägg till bildens URL eller ID
//     });

//     await newRecipe.save();
//     res.status(201).json(newRecipe);
//   } catch (error) {
//     console.error("Error creating post:", error);
//     res.status(500).json({ message: "Failed to create post" });
//   }
// };

export const createRecipesWithImage = async (req, res) => {
  try {
    // Kontrollera om användaren är inloggad genom sessionen
    if (!req.session || !req.session.userId) {
      return res
        .status(401)
        .json({ message: "Du måste vara inloggad för att skapa ett recept" });
    }

    // Hämta användarens ID från sessionen
    const userId = req.session.userId;

    // Hämta receptdata från requestens body
    const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
      req.body;
    console.log("Inkommande data:", req.body);

    // Skapa ett nytt recept och koppla det till användaren
    const newRecipe = await createNewRecipe(
      { title, ingredients, steps, difficulty, cookingTime, imageUrl },
      userId
    );

    // Skicka tillbaka det skapade receptet som svar
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Fel vid skapande av recept:", error);
    res.status(500).json({ message: "Kunde inte skapa receptet" });
  }
};

/* Update recipes, found by Id */
export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
    req.body;

  try {
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      id,
      {
        title,
        ingredients,
        steps,
        difficulty,
        cookingTime,
        imageUrl,
      },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
    console.log("Uppdaterat recept:", updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ message: "Failed to update recipe" });
  }
};

/* Delete recipe with ID */
export const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await RecipeModel.findByIdAndDelete(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully", recipe });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};

// Hämta användarens skapade recept
export const getUserRecipes = async (req, res) => {
  try {
    // Hämta användarens ID från sessionen
    const userId = req.session.userId;

    // Hitta användaren i databasen och populera "recipesCreated"-fältet
    const user = await UserModel.findById(userId).populate("recipesCreated");

    if (!user) {
      return res.status(404).json({ message: "Användaren kunde inte hittas" });
    }

    // Skicka tillbaka användarens skapade recept
    res.status(200).json(user.recipesCreated);
  } catch (error) {
    console.error("Fel vid hämtning av recept:", error);
    res.status(500).json({ message: "Något gick fel" });
  }
};

export const likeRecipe = async (req, res) => {
  try {
    // Hämta användarens ID från sessionen
    const userId = req.session.userId;

    // Hämta receptet som användaren vill "like"
    const { recipeId } = req.body; // Förutsatt att receptets ID skickas i body

    // Hitta användaren och receptet
    const user = await UserModel.findById(userId);
    const recipe = await RecipeModel.findById(recipeId);

    if (!user || !recipe) {
      return res
        .status(404)
        .json({ message: "Användare eller recept inte hittat" });
    }

    // Om användaren redan har gillat receptet, ta bort like
    if (user.likedRecipes.includes(recipeId)) {
      // Ta bort från användarens likedRecipes
      user.likedRecipes = user.likedRecipes.filter(
        (id) => id.toString() !== recipeId
      );

      // Ta bort användaren från receptets likedBy
      recipe.likedBy = recipe.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );

      await user.save();
      await recipe.save();

      return res.status(200).json({ message: "Like removed" });
    } else {
      // Lägg till receptet i användarens likedRecipes
      user.likedRecipes.push(recipeId);

      // Lägg till användaren i receptets likedBy
      recipe.likedBy.push(userId);

      await user.save();
      await recipe.save();

      return res.status(200).json({ message: "Recipe liked" });
    }
  } catch (error) {
    console.error("Fel vid hantering av like:", error);
    res.status(500).json({ message: "Något gick fel" });
  }
};

export const getLikedRecipes = async (req, res) => {
  try {
    const userId = req.session.userId; // Hämta användarens ID från sessionen

    // Hitta användaren med deras likedRecipes
    const user = await UserModel.findById(userId).populate("likedRecipes");

    if (!user) {
      return res.status(404).json({ message: "Användaren kunde inte hittas" });
    }

    // Skicka tillbaka alla gillade recept
    res.status(200).json(user.likedRecipes);
  } catch (error) {
    console.error("Fel vid hämtning av gillade recept:", error);
    res.status(500).json({ message: "Något gick fel" });
  }
};

export default recipeRouter;
