import mongoose, { Schema, model } from "mongoose";
import enumCategories from "../utils/enumCategories.js";

const postSchema = new Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      maxLength: 150,
      required: true,
    },
    content: {
      type: String,
      minLength: 150,
      maxLength: 500,
      required: true,
    },
    categories: {
      type: [String],
      enum: enumCategories,
      minLength: 1,
      maxLength: 5,
      required: true,
    },
    reason: {
      type: String,
    },
    actived: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const postModel = model("posts", postSchema);

export default postModel;
