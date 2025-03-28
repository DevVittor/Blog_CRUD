import { z } from "zod";
import userModel from "../../../models/userModels.js";
import postModel from "../../../models/postModels.js";
import { Types } from "mongoose";

const banPost = async (req, res) => {
  const bodySchema = z.object({
    adminId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
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
      .json({ error: "Dados iválidos", details: bodyValidation.error.errors });
  }
  const { ...data } = bodyValidation.data;
  try {
    const isAdmin = await userModel.findById(data.adminId).select("_id role");
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(400).json({ error: "Não foi possível banir o post" });
    }

    const searchPost = await postModel
      .findById(data.postId)
      .select("_id authodId");
    if (!searchPost) {
      return res.status(400).json({ error: "Esse post não existe" });
    }

    await userModel.findByIdAndUpdate(
      searchPost.authorId,
      {
        $pull: { postId: data.postId },
        $inc: { limit: 1 },
      },
      { new: true }
    );
    await postModel.findByIdAndDelete(data.postId);
    return res.status(201).json({ msg: "Post banido com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível banir esse post no momento.",
      details: error.message,
    });
  }
};

export default banPost;
