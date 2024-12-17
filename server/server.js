import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

// Anslut till MongoDB och starta servern
async function main() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Successfully connected to MongoDB!");

    // app.listen(3000, () => {
    //   console.log("Server is running at http://localhost:3000");
    // });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

main().catch((error) => console.error(error));
export default app;
