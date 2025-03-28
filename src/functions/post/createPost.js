import { z } from "zod";
import userModel from "../../models/userModels.js";
import postModel from "../../models/postModels.js";
import { Types } from "mongoose";

const createPost = async (req, res) => {
  const bodySchema = z.object({
    authorId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    title: z.coerce.string().nonempty().max(150),
    content: z.coerce.string().min(150).max(500),
    categories: z.array(z.string()),
  });
  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }
  const { ...data } = bodyValidation.data;
  try {
    const userExist = await userModel
      .findById(data.authorId)
      .select("_id blocked limit role username");
    if (!userExist || userExist.blocked === true) {
      return res
        .status(400)
        .json({ error: "Não foi possível localizar o usuário." });
    }
    const postDuplicate = await postModel
      .findOne({ $or: [{ title: data.title }, { content: data.content }] })
      .select("_id title");
    if (postDuplicate) {
      return res
        .status(409)
        .json({ error: "Não foi possível publicar esse post." });
    }

    if (userExist.limit <= 0 && userExist.role !== "admin") {
      return res.status(403).json({ error: "Você não tem mais créditos." });
    }

    const newPost = await postModel.create({
      authorId: data.authorId,
      author: userExist.username,
      title: data.title,
      content: data.content,
      categories: data.categories,
    });

    if (userExist.role === "user") {
      await userModel.findByIdAndUpdate(
        data.authorId,
        {
          $set: { role: "author" },
          $inc: { limit: -1 },
        },
        { new: true }
      );
    }

    await userModel.findByIdAndUpdate(
      data.authorId,
      {
        $addToSet: { postId: newPost._id },
      },
      { new: true }
    );
    return res.status(201).json({ msg: "Post criado com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível criar um post no momento.",
      details: error.message,
    });
  }
};

export default createPost;
