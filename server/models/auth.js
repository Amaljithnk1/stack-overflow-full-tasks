import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: String,
  browser: String,
  os: String,
  device: String,
});


const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  avatar: { type: String }, // Add this line
  joinedOn: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  loginHistory: [loginHistorySchema],
});

export default mongoose.model("User", userSchema);
