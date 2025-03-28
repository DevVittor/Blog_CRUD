import { z } from "zod";
import userModel from "../../../models/userModels.js";
import postModel from "../../../models/postModels.js";

const blockPost = async (req, res) => {
  const bodySchema = z.object({
    adminId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    postId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    reason: z.coerce.string().nonempty(),
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

    const postExist = await postModel
      .findById(data.postId)
      .select("_id actived");
    if (!postExist || postExist.actived === false) {
      return res
        .status(400)
        .json({ error: "Não foi possível localizar esse post." });
    }

    await postModel.findByIdAndUpdate(
      data.postId,
      {
        $set: { actived: false, reason: data.reason },
      },
      { new: true }
    );
    return res.status(201).json({ msg: "Post bloqueado", reason: data.reason });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível bloquear esse post",
      details: error.message,
    });
  }
};

export default blockPost;
