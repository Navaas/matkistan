// src/user/user-model.js
import mongoose from "mongoose";

// Definiera användarschemat
const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Skapa och exportera användarmodellen
const User = mongoose.model("User", UserSchema);
export default User;
