import { z } from "zod";
import userModel from "../../models/userModels.js";
import postModel from "../../models/postModels.js";
import { Types } from "mongoose";

const alterContent = async (req, res) => {
  const bodySchema = z.object({
    authorId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    postId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    newContent: z.coerce.string().min(150).max(500),
  });
  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }
  const { ...data } = bodyValidation.data;
  try {
    const authorExist = await userModel.findOne({
      $and: [{ _id: data.authorId }, { role: "author" }],
    });
    if (!authorExist) {
      return res
        .status(400)
        .json({ error: "Não foi possível alterar o conteudo do post" });
    }
    const myPost = await postModel
      .findOne({
        $and: [{ authorId: data.authorId }, { _id: data.postId }],
      })
      .select("_id authorId postId actived");
    if (!myPost || myPost.actived === false) {
      return res
        .status(400)
        .json({ error: "Não foi possível fazer nenhuma alteração" });
    }
    const contentDuplicate = await postModel
      .findOne({ content: data.newContent })
      .select("_id content");
    if (contentDuplicate) {
      return res
        .status(403)
        .json({ error: "Já tem um post com esse conteúdo." });
    }
    await postModel.findByIdAndUpdate(
      data.postId,
      {
        $set: { content: data.newContent },
      },
      { new: true }
    );
    return res.status(201).json({ msg: "Conteúdo alterado com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível fazer alteração do conteúdo do post.",
      details: error.message,
    });
  }
};

export default alterContent;
