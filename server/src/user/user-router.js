import express from "express";
import { authenticateToken } from "../../middlewares.js";
import {
  deleteUser,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "./user-handlers.js";
import UserModel from "./user-model.js";

const userRouter = express.Router();

userRouter.get("/users", getUsers);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.delete("/deleteUser", deleteUser);
userRouter.put("/updateUser/:id", authenticateToken, updateUser);

userRouter.get("/auth", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await UserModel.findById(userId)
      .select("-password")
      .populate("recipesCreated", "title ingredients, imageUrl createdBy")
      .populate("likedRecipes", "title ingredients");

    if (!user) {
      return res.status(404).json({ message: "Användare inte hittad" });
    }

    return res.status(200).json({
      message: "Användardata hämtad",
      user: {
        id: user._id,
        firstname: user.firstname,
        username: user.username,
        email: user.email,
        recipesCreated: user.recipesCreated,
        likedRecipes: user.likedRecipes,
      },
    });
  } catch (error) {
    console.error("Fel vid hämtning av användardata:", error);
    return res.status(500).json({ message: "Kunde inte hämta användardata" });
  }
});

export default userRouter;
