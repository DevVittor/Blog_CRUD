import mongoose, { Schema, model } from "mongoose";
import enumRoles from "../utils/enumRoles.js";

const userSchema = new Schema(
  {
    postId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: enumRoles,
      default: "user",
    },
    limit: {
      type: Number,
    },
    reason: {
      type: String,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = model("users", userSchema);

export default userModel;
