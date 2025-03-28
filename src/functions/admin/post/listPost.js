import { z } from "zod";
import userModel from "../../../models/userModels.js";
import postModel from "../../../models/postModels.js";
import { Types } from "mongoose";

const listPost = async (req, res) => {
  const bodySchema = z.object({
    adminId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
  });
  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }
  const { adminId } = bodyValidation.data;
  try {
    const isAdmin = await userModel.findById(adminId).select("_id role");
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(400).json({ error: "Não foi possível prosseguir!" });
    }
    const countPost = await postModel.countDocuments();
    if (countPost <= 0) {
      return res
        .status(400)
        .json({ error: "Não temos nenhum post no momento." });
    }

    const posts = await postModel.find();
    return res
      .status(200)
      .json({ msg: "Aqui está todos os posts", list: posts });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível mostrar a lista de post",
      details: error.message,
    });
  }
};

export default listPost;
