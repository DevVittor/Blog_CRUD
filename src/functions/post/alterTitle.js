import { z } from "zod";
import userModel from "../../models/userModels.js";
import postModel from "../../models/postModels.js";
import { Types } from "mongoose";

const alterTitle = async (req, res) => {
  const bodySchema = z.object({
    authorId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    postId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    newTitle: z.coerce.string().nonempty().max(150),
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
        .json({ error: "Não foi possível alterar o titulo do post" });
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
    const titleDuplicate = await postModel
      .findOne({ title: data.newTitle })
      .select("_id title");
    if (titleDuplicate) {
      return res.status(403).json({ error: "Já tem um post com esse título." });
    }
    await postModel.findByIdAndUpdate(
      data.postId,
      {
        $set: { title: data.newTitle },
      },
      { new: true }
    );
    return res.status(201).json({ msg: "Titulo alterado com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível fazer alteração do título do post.",
      details: error.message,
    });
  }
};

export default alterTitle;
