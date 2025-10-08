import mongoose from "mongoose";

const vaultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    siteName: {
      type: String,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,  
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("VaultItem", vaultSchema);
