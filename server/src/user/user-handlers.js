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
    // Hämta användaren och inkludera lösenordet (dolt som standard)
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

// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   // Kontrollera om både email och lösenord är med i förfrågan
//   if (!email || !password) {
//     return res.status(400).json("Missing email or password");
//   }

//   try {
//     // Hitta användaren i databasen baserat på email
//     const user = await UserModel.findOne({ email });

//     if (!user) {
//       return res.status(404).json("User not found");
//     }

//     // Verifiera det angivna lösenordet med det hashade lösenordet i databasen
//     const isPasswordValid = await argon2.verify(user.password, password);

//     if (!isPasswordValid) {
//       return res.status(401).json("Invalid password");
//     }

//     // Om lösenordet är korrekt, returnera användaren (utan lösenordet)
//     const userWithoutPassword = await UserModel.findOne({ email }).select("-password");

//     res.status(200).json(userWithoutPassword);  // Skicka användardatan utan lösenordet
//   } catch (error) {
//     console.error("Error logging in user:", error);
//     res.status(500).json("Failed to log in");
//   }
// };
