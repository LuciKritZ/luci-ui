const mongoose = require("mongoose");

// Define Schema manually for the test script
const ApiKeySchema = new mongoose.Schema({
  createdAt: { default: Date.now, type: Date },
  encryptedKey: { required: true, type: String },
  iv: { required: true, type: String },
  provider: { required: true, type: String },
});

const UserSchema = new mongoose.Schema({
  apiKeys: [ApiKeySchema],
  email: { required: true, type: String, unique: true },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function test() {
  const URI =
    "mongodb://admin:password123@localhost:27017/luci-ui?authSource=admin";
  console.log("Connecting to:", URI);

  try {
    await mongoose.connect(URI);
    console.log("Connected!");

    const user = await User.findOne({ email: "hi@krishalshah.in" });
    if (!user) {
      console.log("User not found!");
      return;
    }

    console.log("User found:", user.email);
    console.log("Current keys:", user.apiKeys.length);

    user.apiKeys.push({
      encryptedKey: "test-key",
      iv: "test-iv",
      provider: "Test",
    });

    await user.save();
    console.log("Save successful!");

    // Clean up
    user.apiKeys = user.apiKeys.filter(k => k.provider !== "Test");
    await user.save();
    console.log("Cleanup successful!");
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
