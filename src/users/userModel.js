const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarURL: { type: String },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  status: {
    type: String,
    required: true,
    enum: ["Verified", "Created"],
    default: "Created",
  },
  token: { type: String, required: false },
  verificationToken: { type: String, required: false },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
