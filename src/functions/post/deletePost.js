import { Types } from "mongoose";
import { z } from "zod";
import postModel from "../../models/postModels.js";
import userModel from "../../models/userModels.js";

const deletePost = async (req, res) => {
  const bodySchema = z.object({
    authorId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    postId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
  });
  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }
  const { ...data } = bodyValidation.data;
  try {
    const authorExist = await userModel
      .findById(data.authorId)
      .select("_id postId role");
    if (!authorExist) {
      return res.status(400).json({ error: "Não encontramos esse author" });
    }
    const myPost = await postModel
      .findOne({
        $and: [{ authorId: data.authorId }, { _id: data.postId }],
      })
      .select("_id authorId");
    if (!myPost) {
      return res.status(403).json({ error: "Não foi possível deletar o post" });
    }
    await postModel.findByIdAndDelete(data.postId);
    if (authorExist.role === "admin") {
      await userModel.findByIdAndUpdate(
        data.authorId,
        {
          $pull: { postId: data.postId },
        },
        { new: true }
      );
      return res.status(201).json({ msg: "Post deletado com sucesso!" });
    }

    const user = await userModel.findByIdAndUpdate(
      data.authorId,
      {
        $pull: { postId: data.postId },
        $inc: { limit: 1 },
      },
      { new: true }
    );
    if (user.postId.length <= 0) {
      await userModel.findByIdAndUpdate(
        data.authorId,
        {
          $set: { role: "user", limit: 5 },
        },
        { new: true }
      );
    }
    return res.status(201).json({ msg: "Post deletado com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível deletar esse post.",
      details: error.message,
    });
  }
};

export default deletePost;
