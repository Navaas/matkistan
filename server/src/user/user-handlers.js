import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserModel, userZodSchema } from "./user-model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();

    if (!users || users.length === 0) {
      console.log("Inga användare hittades.");
      return res.status(404).json({ message: "No users found" });
    }

    console.log("Användare från databasen:", JSON.stringify(users, null, 2));
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const registerUser = async (req, res) => {
  const { firstname, username, email, password } = req.body;

  try {
    const validatedData = userZodSchema.parse({
      firstname,
      username,
      email,
      password,
    });

    console.log("Received user data:", validatedData);

    const existingUserInDB = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUserInDB) {
      console.log("User already exists:", existingUserInDB);
      return res.status(409).json("Email or username is already registered");
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = new UserModel({
      firstname,
      username,
      email,
      password: hashedPassword,
      recipesCreated: [],
      likedRecipes: [],
    });

    await newUser.save();

    console.log("New user created:", newUser);

    const user = await UserModel.findOne({ email }).select("-password");

    console.log("User sent in response:", user);

    res.status(201).send(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    console.error("Error creating user:", error);
    res.status(500).json("Failed to register user");
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json("Användarnamn och lösenord krävs");
  }

  try {
    const user = await UserModel.findOne({ username: username }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json("Fel användarnamn eller lösenord");
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(401).json("Fel användarnamn eller lösenord");
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Generated Token:", token);

    console.log("User logged in:", {
      id: user._id,
      username: user.username,
    });

    return res.status(200).json({
      message: "Inloggning lyckades",
      token, // Skickar tillbaka token till klienten
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Fel vid inloggning:", error);
    return res
      .status(500)
      .json({ error: "Kunde inte logga in", details: error.message });
  }
};

// export const loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json("Användarnamn och lösenord krävs");
//   }

//   try {
//     const user = await UserModel.findOne({ username: username }).select(
//       "+password"
//     );

//     if (!user) {
//       return res.status(401).json("Fel användarnamn eller lösenord");
//     }

//     const isPasswordValid = await argon2.verify(user.password, password);

//     if (!isPasswordValid) {
//       return res.status(401).json("Fel användarnamn eller lösenord");
//     }

//     console.log("User logged in:", {
//       id: user._id,
//       username: user.username,
//     });

//     req.session = {
//       userId: user._id,
//       username: user.username,
//     };

//     console.log("Session skapad:", req.session);

//     return res.status(200).json({
//       message: "Inloggning lyckades",
//       user: {
//         id: user._id,
//         username: user.username,
//       },
//     });
//   } catch (error) {
//     console.error("Fel vid inloggning:", error);
//     return res.status(500).json({ error: "Kunde inte logga in" });
//   }
// };

export const logoutUser = async (req, res) => {
  try {
    console.log("Session före utloggning:", req.session);

    if (!req.session || !req.session.userId) {
      return res
        .status(400)
        .json({ error: "Ingen aktiv session att logga ut från" });
    }

    const userId = req.session.userId;
    const username = req.session.username;
    console.log(`Användare loggas ut: ID=${userId}, Username=${username}`);

    req.session = null;

    console.log("Användaren är utloggad");
    return res.status(200).send("Du är nu utloggad");
  } catch (error) {
    console.error("Fel vid utloggning:", error);
    return res.status(500).json({ error: "Problem att logga ut" });
  }
};

export const updateUser = async (req, res) => {
  const { username, email, firstname, password } = req.body;
  const userId = req.params.id;

  if (!req.session || !req.session.userId || req.session.userId !== userId) {
    return res.status(401).json({
      error: "Du måste vara inloggad för att uppdatera dina uppgifter",
    });
  }

  try {
    const validationResult = userZodSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Ogiltig data",
        issues: validationResult.error.errors,
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Användare inte hittad" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (firstname) user.firstname = firstname;

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          error: "Lösenordet måste vara minst 8 tecken långt",
        });
      }

      const hashedPassword = await argon2.hash(password);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    console.log("Användare uppdaterad:", updatedUser);

    return res.status(200).json({
      message: "Dina uppgifter har uppdaterats",
      user: {
        id: updatedUser._id,
        userName: updatedUser.username,
        email: updatedUser.email,
        firstname: updatedUser.firstname,
        password: updatedUser.password,
      },
    });
  } catch (error) {
    console.error("Fel vid uppdatering av användare:", error);
    return res.status(500).json({ error: "Kunde inte uppdatera användaren" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res
        .status(401)
        .json({ error: "Du måste vara inloggad för att ta bort ditt konto" });
    }

    const userId = req.session.userId;

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "Användaren kunde inte hittas." });
    }

    req.session = null;

    return res.status(200).json({ message: "Ditt konto har tagits bort" });
  } catch (error) {
    console.error("Fel vid borttagning av användare:", error);
    return res.status(500).json({ error: "Kunde inte ta bort kontot" });
  }
};

// export async function getLoggedInUser(req, res) {
//   console.log("Session vid auth:", req.session);

//   if (!req.session?.userId) {
//     return res.status(401).json("Du är inte inloggad");
//   }

//   try {
//     const user = await UserModel.findById(req.session.userId)
//       .populate("recipesCreated")
//       .populate("likedRecipes")
//       .exec();

//     if (!user) {
//       return res.status(404).json("Användaren finns inte");
//     }

//     return res.status(200).json({
//       message: "Du är inloggad",
//       user: {
//         id: user._id,
//         firstname: user.firstname,
//         username: user.username,
//         email: user.email,
//         recipesCreated: user.recipesCreated,
//         likedRecipes: user.likedRecipes,
//       },
//     });
//   } catch (error) {
//     console.error("Fel vid hämtning av användardata:", error);
//     return res.status(500).json("Kunde inte hämta användardata");
//   }
// }

// export async function getLoggedInUser(req, res) {
//   console.log("Användardata från JWT:", req.user);

//   try {
//     // Hämta användaren med ID från JWT-tokenen
//     const user = await UserModel.findById(req.user.id)
//       .populate("recipesCreated")
//       .populate("likedRecipes")
//       .exec();

//     if (!user) {
//       return res.status(404).json("Användaren finns inte");
//     }

//     return res.status(200).json({
//       message: "Du är inloggad",
//       user: {
//         id: user._id,
//         firstname: user.firstname,
//         username: user.username,
//         email: user.email,
//         recipesCreated: user.recipesCreated,
//         likedRecipes: user.likedRecipes,
//       },
//     });
//   } catch (error) {
//     console.error("Fel vid hämtning av användardata:", error);
//     return res.status(500).json("Kunde inte hämta användardata");
//   }
// }
