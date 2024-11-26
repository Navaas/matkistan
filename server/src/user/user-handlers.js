import argon2 from "argon2";
import UserModel from "./user-model.js";

// Funktion för att hämta alla användare
export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find(); // Hämta alla användare från databasen

    if (!users || users.length === 0) {
      console.log("Inga användare hittades.");
      return res.status(404).json({ message: "No users found" });
    }

    console.log("Användare från databasen:", JSON.stringify(users, null, 2));
    res.json(users); // Skicka användardata som JSON
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

/* Register new user */
export const registerUser = async (req, res) => {
  const { firstname, username, email, password } = req.body;

  // Kontrollera om alla obligatoriska fält finns
  if (!firstname || !username || !email || !password) {
    return res
      .status(400)
      .json("Missing firstname, username, email, or password");
  }

  try {
    console.log("Received user data:", req.body);
    console.log("Received user data:", req.body);

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json("Invalid email format");
    }

    // Kontrollera om användaren redan finns i databasen via e-post eller användarnamn
    const existingUserInDB = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUserInDB) {
      console.log("User already exists:", existingUserInDB);
      return res.status(409).json("Email or username is already registered");
    }

    // Hasha lösenordet med argon2
    const hashedPassword = await argon2.hash(password);

    // Skapa och spara den nya användaren
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

    // Hämta användaren utan lösenordet
    const user = await UserModel.findOne({ email }).select("-password");

    console.log("User sent in response:", user);

    res.status(201).send(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json("Failed to register user");
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Kontrollera att användarnamn och lösenord finns med
  if (!username || !password) {
    return res.status(400).json("Användarnamn och lösenord krävs");
  }

  try {
    // Hämta användaren och inkludera lösenordet
    const user = await UserModel.findOne({ username: username }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json("Fel användarnamn eller lösenord");
    }

    // Verifiera lösenordet
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(401).json("Fel användarnamn eller lösenord");
    }

    console.log("User logged in:", {
      id: user._id,
      username: user.username,
    });

    // Spara användaruppgifter i sessionen
    req.session = {
      userId: user._id, // Användarens ID
      username: user.username, // Användarens användarnamn
    };

    console.log("Session skapad:", req.session);

    // Returnera en lyckad inloggningsrespons
    return res.status(200).json({
      message: "Inloggning lyckades",
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Fel vid inloggning:", error);
    return res.status(500).json({ error: "Kunde inte logga in" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    console.log("Session före utloggning:", req.session);

    if (!req.session || !req.session.userId) {
      return res
        .status(400)
        .json({ error: "Ingen aktiv session att logga ut från" });
    }

    req.session = null; // Rensa sessionen

    console.log("Användaren är utloggad");
    return res.status(200).send("Du är nu utloggad");
  } catch (error) {
    console.error("Fel vid utloggning:", error);
    return res.status(500).json({ error: "Problem att logga ut" });
  }
};

export const updateUser = async (req, res) => {
  const { username, email, firstname } = req.body;
  const userId = req.params.id; // Hämta användarens id från URL-parametrarna

  // Kontrollera om användaren är inloggad och har rätt session
  if (!req.session || !req.session.userId || req.session.userId !== userId) {
    return res.status(401).json({
      error: "Du måste vara inloggad för att uppdatera dina uppgifter",
    });
  }

  try {
    // Hämta den användare som ska uppdateras
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Användare inte hittad" });
    }

    // Uppdatera användarens uppgifter
    if (username) user.username = username;
    if (email) user.email = email;
    if (firstname) user.firstname = firstname;

    // Spara de uppdaterade uppgifterna
    const updatedUser = await user.save();

    console.log("Användare uppdaterad:", updatedUser);

    return res.status(200).json({
      message: "Dina uppgifter har uppdaterats",
      user: {
        id: updatedUser._id,
        userName: updatedUser.username,
        email: updatedUser.email,
        firstname: updatedUser.firstname,
      },
    });
  } catch (error) {
    console.error("Fel vid uppdatering av användare:", error);
    return res.status(500).json({ error: "Kunde inte uppdatera användaren" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Kontrollera om det finns en aktiv session
    if (!req.session || !req.session.userId) {
      return res
        .status(401)
        .json({ error: "Du måste vara inloggad för att ta bort ditt konto" });
    }

    const userId = req.session.userId;

    // Försök att hitta och ta bort användaren
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        error: "Användaren kunde inte hittas eller har redan tagits bort",
      });
    }

    console.log("Användare borttagen:", deletedUser);

    // Rensa sessionen efter att kontot tagits bort
    req.session = null;

    return res.status(200).json({ message: "Ditt konto har tagits bort" });
  } catch (error) {
    console.error("Fel vid borttagning av användare:", error);
    return res.status(500).json({ error: "Kunde inte ta bort kontot" });
  }
};

// Funktion för att hämta inloggad användare
export async function getLoggedInUser(req, res) {
  console.log("Session vid auth:", req.session); // Logga sessionen för att se om sessionen finns
  if (!req.session?.userId) {
    return res.status(401).json("Du är inte inloggad");
  }

  return res.status(200).json({
    message: "Du är inloggad",
    session: req.session,
  });
}
