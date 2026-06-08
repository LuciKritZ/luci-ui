import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";

import ActionDefinition from "../models/action-definition.model";
import User from "../models/user.model";
import dbConnect from "../utils/db.utils";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// -------------------------------------------------------------
// CONFIGURATION
// Update these values to initialize the database with your
// desired admin credentials.
// -------------------------------------------------------------
const SEED_USER = {
  email: "admin@luci.app", // Must be valid email format and match ALLOWED_EMAILS if configured
  name: "Admin User",
  password: "password123", // Will be hashed securely
};

// -------------------------------------------------------------
// INITIAL ACTION DEFINITIONS
// -------------------------------------------------------------
const INITIAL_ACTIONS = [
  {
    fallbackModel: "gemini-3.5-flash",
    model: "gemini-3-flash-preview",
    name: "createTheme",
    prompt:
      "You are an expert UI/UX designer. Create a beautiful, modern, and cohesive color theme based on the following request: {{prompt}}\n\nProvide exactly 3 distinct themes. Each theme must be a valid JSON object matching the `ITheme` interface structure. Output ONLY a valid JSON array of these 3 objects. Do not include markdown formatting or explanations.",
  },
  {
    fallbackModel: "gemini-3.5-flash",
    model: "gemini-3-flash-preview",
    name: "createThemeVariations",
    prompt:
      "You are an expert UI/UX designer. Based on this existing theme:\n{{theme}}\n\nGenerate exactly 3 variations of this theme incorporating the following request: {{prompt}}\n\nThe variations should maintain the core identity but introduce meaningful changes based on the request. Output ONLY a valid JSON array of 3 theme objects matching the `ITheme` interface. Do not include markdown formatting or explanations.",
  },
  {
    fallbackModel: "gemini-3.5-flash",
    model: "gemini-3-flash-preview",
    name: "createStyles",
    prompt:
      'You are an expert UI/UX designer specializing in modern web aesthetics.\nGiven the following theme:\n{{theme}}\n\nAnd the user request: {{prompt}}\n\nGenerate exactly 3 distinct, creative style names that capture the essence of the theme and request (e.g., "Neon Cyberpunk", "Minimalist Zen", "Brutalist Corporate").\nOutput ONLY a valid JSON array of these 3 strings. Do not include markdown formatting or explanations.',
  },
  {
    fallbackModel: "gemini-3.5-flash",
    model: "gemini-3-flash-preview",
    name: "createThemeArtifacts",
    prompt:
      "You are an expert frontend developer and designer. Based on the following theme:\n{{theme}}\n\nAnd this specific style instruction:\n{{styleInstruction}}\n\nGenerate a functional React component that implements the requested UI: {{prompt}}\n\nThe component should be styled using Tailwind CSS classes that align with the provided theme and style instructions. Ensure the component is complete, responsive, and uses modern React patterns. Output ONLY the React component code, without markdown formatting.",
  },
];

async function seedDatabase() {
  console.log("🌱 Starting database initialization...");

  try {
    await dbConnect();
    console.log("✅ Connected to MongoDB");

    // 1. Seed User
    console.log("👤 Initializing admin user...");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(SEED_USER.email)) {
      throw new Error(`Invalid email format: ${SEED_USER.email}`);
    }

    let user = await User.findOne({ email: SEED_USER.email });

    if (user) {
      console.log(
        `ℹ️ User with email ${SEED_USER.email} already exists. Skipping user creation.`
      );
    } else {
      console.log(`Creating user ${SEED_USER.email}...`);
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(SEED_USER.password, salt);

      user = await User.create({
        email: SEED_USER.email,
        name: SEED_USER.name,
        password: hashedPassword,
      });
      console.log(`✅ Admin user created successfully (ID: ${user._id})`);
    }

    // 2. Seed Action Definitions
    console.log("\n⚙️ Initializing action definitions...");

    for (const actionData of INITIAL_ACTIONS) {
      const existingAction = await ActionDefinition.findOne({
        name: actionData.name,
      });

      if (existingAction) {
        // Update existing to ensure prompt/models are up to date
        existingAction.prompt = actionData.prompt;
        existingAction.model = actionData.model;
        existingAction.fallbackModel = actionData.fallbackModel;
        await existingAction.save();
        console.log(`🔄 Updated existing action: ${actionData.name}`);
      } else {
        await ActionDefinition.create(actionData);
        console.log(`✨ Created new action: ${actionData.name}`);
      }
    }

    console.log("\n🎉 Database initialization completed successfully!");
  } catch (error) {
    console.error("\n❌ Error during database initialization:", error);
  } finally {
    // Close the Mongoose connection to allow the script to exit
    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
    process.exit(0);
  }
}

seedDatabase();
