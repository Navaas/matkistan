import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { z } from "zod";
import { CategoryModel } from "../category/category-model.js";
import UserModel from "../user/user-model.js";
import { RecipeModel, recipeZodSchema } from "./recipe-model.js";

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

export const createNewRecipe = async (recipeData, userId) => {
  const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
    recipeData;

  try {
    const validatedRecipe = recipeZodSchema.parse(recipeData);

    // Skapa ett nytt recept och koppla det till användaren
    const newRecipe = new RecipeModel({
      ...validatedRecipe,
      title,
      ingredients,
      steps,
      difficulty,
      cookingTime,
      imageUrl,
      createdBy: userId,
    });

    await newRecipe.save();

    await UserModel.findByIdAndUpdate(userId, {
      $push: { recipesCreated: newRecipe._id },
    });

    return newRecipe; // Returnera det skapade receptet
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Valideringsfel:", error.error);
      throw new Error(
        "Valideringsfel: Kontrollera att alla fält är korrekt ifyllda"
      );
    }
    console.error("Error creating post:", error);
    throw new Error("Kunde inte skapa receptet");
  }
};
export const createRecipesWithImage = async (req, res) => {
  try {
    // Hämta token från Authorization headern
    const token = req.header("Authorization")?.split(" ")[1];

    // Om token saknas, returnera Unauthorized
    if (!token) {
      return res
        .status(401)
        .json({ message: "Du måste vara inloggad för att skapa ett recept" });
    }

    // Verifiera JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Använd din hemliga nyckel här
    const userId = decoded.id; // Extrahera användarens ID från token

    const {
      title,
      ingredients,
      steps,
      difficulty,
      cookingTime,
      imageUrl,
      categories,
    } = req.body;

    console.log("Inkommande data:", req.body);

    // Validera receptdata med Zod
    try {
      recipeZodSchema.parse({
        title,
        ingredients,
        steps,
        difficulty,
        cookingTime,
        imageUrl,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Valideringsfel:", error.errors);
        return res.status(400).json({
          message:
            "Valideringsfel: Kontrollera att alla fält är korrekt ifyllda",
          errors: error.errors,
        });
      }

      throw error; // Om det är ett annat typ av fel
    }

    // Kontrollera att alla kategorier finns i databasen
    if (categories && categories.length > 0) {
      // Hämta alla kategorier från databasen
      const existingCategories = await CategoryModel.find({
        name: { $in: categories },
      });

      // Om vi inte hittar alla kategorier, returnera ett fel
      if (existingCategories.length !== categories.length) {
        return res.status(400).json({
          message: "En eller flera kategorier är ogiltiga eller saknas",
        });
      }

      // Skapa ett nytt recept och koppla det till användaren
      const newRecipe = await RecipeModel.create({
        title,
        ingredients,
        steps,
        difficulty,
        cookingTime,
        imageUrl,
        userId, // Koppla receptet till användaren
      });

      // Koppla kategorierna till receptet genom att använda deras ObjectId:s
      newRecipe.categories = existingCategories.map((category) => category._id);

      await newRecipe.save();

      // Lägg till receptet i användarens `recipesCreated`-array
      await UserModel.findByIdAndUpdate(userId, {
        $addToSet: { recipesCreated: newRecipe._id },
      });

      // Skicka tillbaka det skapade receptet som svar
      res.status(201).json(newRecipe);
    } else {
      return res.status(400).json({ message: "Kategorier är obligatoriska" });
    }
  } catch (error) {
    console.error("Fel vid skapande av recept:", error);

    // Hantera JWT-relaterade fel
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Ogiltig eller utgången token" });
    }

    // Om något annat går fel
    res.status(500).json({ message: "Kunde inte skapa receptet" });
  }
};
// export const createRecipesWithImage = async (req, res) => {
//   try {
//     if (!req.session || !req.session.userId) {
//       return res
//         .status(401)
//         .json({ message: "Du måste vara inloggad för att skapa ett recept" });
//     }

//     const userId = req.session.userId;

//     const {
//       title,
//       ingredients,
//       steps,
//       difficulty,
//       cookingTime,
//       imageUrl,
//       categories,
//     } = req.body;

//     console.log("Inkommande data:", req.body);

//     // Validera receptdata med Zod
//     try {
//       recipeZodSchema.parse({
//         title,
//         ingredients,
//         steps,
//         difficulty,
//         cookingTime,
//         imageUrl,
//       });
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         console.error("Valideringsfel:", error.errors);
//         return res.status(400).json({
//           message:
//             "Valideringsfel: Kontrollera att alla fält är korrekt ifyllda",
//           errors: error.errors,
//         });
//       }

//       throw error; // Om det är ett annat typ av fel
//     }

//     // Kontrollera att alla kategorier finns i databasen
//     if (categories && categories.length > 0) {
//       // Hämta alla kategorier från databasen
//       const existingCategories = await CategoryModel.find({
//         name: { $in: categories },
//       });

//       // Om vi inte hittar alla kategorier, returnera ett fel
//       if (existingCategories.length !== categories.length) {
//         return res.status(400).json({
//           message: "En eller flera kategorier är ogiltiga eller saknas",
//         });
//       }

//       // Skapa ett nytt recept och koppla det till användaren
//       const newRecipe = await createNewRecipe(
//         { title, ingredients, steps, difficulty, cookingTime, imageUrl },
//         userId
//       );

//       // Koppla kategorierna till receptet genom att använda deras ObjectId:s
//       newRecipe.categories = existingCategories.map((category) => category._id);

//       await newRecipe.save();

//       // Lägg till receptet i användarens `recipesCreated`-array
//       await UserModel.findByIdAndUpdate(userId, {
//         $addToSet: { recipesCreated: newRecipe._id },
//       });

//       // Skicka tillbaka det skapade receptet som svar
//       res.status(201).json(newRecipe);
//     } else {
//       return res.status(400).json({ message: "Kategorier är obligatoriska" });
//     }
//   } catch (error) {
//     console.error("Fel vid skapande av recept:", error);
//     res.status(500).json({ message: "Kunde inte skapa receptet" });
//   }
// };

/* Update recipes, found by Id */
export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, steps, difficulty, cookingTime, imageUrl } =
    req.body;

  try {
    if (!req.session || !req.session.userId) {
      return res
        .status(401)
        .json({ message: "Du måste vara inloggad för att skapa ett recept" });
    }

    // Hämta användarens ID från sessionen
    const userId = req.session.userId;

    const recipe = await RecipeModel.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Receptet kunde inte hittas" });
    }

    if (String(recipe.createdBy) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Du har inte behörighet att uppdatera detta recept" });
    }

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

// /* Delete recipe with ID */
// export const deleteRecipe = async (req, res) => {
//   const userId = req.session.userId;
//   const { recipeId } = req.body;
//   const { id } = req.params;

//   try {
//     const recipe = await RecipeModel.findByIdAndDelete(id);

//     if (!recipe) {
//       return res.status(404).json({ message: "Recipe not found" });
//     }

//     res.status(200).json({ message: "Recipe deleted successfully", recipe });
//   } catch (error) {
//     console.error("Error deleting recipe:", error);
//     res.status(500).json({ message: "Failed to delete recipe" });
//   }
// };

export const deleteRecipe = async (req, res) => {
  // Kontrollera om användaren är inloggad
  const userId = req.session?.userId;
  const { id } = req.params; // Hämta recept-ID från URL-parametrarna

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: Please log in." });
  }

  try {
    // Hämta receptet för att verifiera ägarskap
    const recipe = await RecipeModel.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Kontrollera att `createdBy` finns och att det går att läsa
    if (!recipe.createdBy) {
      return res.status(400).json({
        message: "Invalid recipe data: `createdBy` is missing.",
      });
    }

    // Kontrollera om användaren äger receptet
    if (recipe.createdBy.toString() !== userId) {
      return res.status(403).json({
        message: "Forbidden: You don't have permission to delete this recipe.",
      });
    }

    // Ta bort receptet om ägarskap är bekräftat
    await RecipeModel.findByIdAndDelete(id);

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
    const userId = req.session.userId;
    const { recipeId } = req.body;

    console.log("Mottaget recipeId från frontend:", recipeId);

    if (!recipeId || typeof recipeId !== "string") {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }

    // Kontrollera om recipeId är en giltig ObjectId
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      console.log("Ogiltigt recipeId format");
      return res.status(400).json({ message: "Invalid recipe ID format" });
    }

    const user = await UserModel.findById(userId);
    const recipe = await RecipeModel.findById(recipeId);

    if (!user || !recipe) {
      return res.status(404).json({ message: "User or recipe not found" });
    }

    if (user.likedRecipes.includes(recipeId)) {
      user.likedRecipes = user.likedRecipes.filter(
        (id) => id.toString() !== recipeId
      );

      recipe.likedBy = recipe.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );

      await user.save();
      await recipe.save();
      return res.status(200).json({ message: "Like removed" });
    } else {
      user.likedRecipes.push(recipeId);
      recipe.likedBy.push(userId);

      await user.save();
      await recipe.save();
      return res.status(200).json({ message: "Recipe liked" });
    }
  } catch (error) {
    console.error("Fel vid hantering av like:", error);
    return res.status(500).json({ message: "Något gick fel" });
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

export const getSingelRecipe = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  try {
    const recipe = await RecipeModel.findById(id).populate(
      "categories",
      "name"
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);

    res.status(500).json({ message: "Failed to fetch recipe" });
  }
};

// export const getLikeStatus = async (req, res) => {
//   const { recipeId } = req.body;
//   const userId = req.session?.userId;

//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const user = await UserModel.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isLiked = user.likedRecipes.includes(recipeId);
//     console.log(
//       `Like-status för userId: ${userId}, recipeId: ${recipeId}:`,
//       isLiked
//     );

//     res.status(200).json({ isLiked });
//   } catch (error) {
//     console.error("Error checking like status:", error);
//     res.status(500).json({ message: "Failed to check like status" });
//   }
// };
export const getLikeStatus = async (req, res) => {
  const { recipeId } = req.body;

  // Hämta token från Authorization headern
  const token = req.header("Authorization")?.split(" ")[1]; // Hämta token från "Bearer <token>"

  // Om token saknas, returnera Unauthorized
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verifiera JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Använd din hemliga nyckel här
    const userId = decoded.id; // Extrahera användarens ID från token

    // Hitta användaren i databasen
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kontrollera om användaren har gillat det specifika receptet
    const isLiked = user.likedRecipes.includes(recipeId);

    // Skicka tillbaka isLiked-statusen
    res.status(200).json({ isLiked });
  } catch (error) {
    console.error("Error checking like status:", error);

    // Hantera JWT-relaterade fel
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Om något annat går fel
    res.status(500).json({ message: "Failed to check like status" });
  }
};

export default recipeRouter;
