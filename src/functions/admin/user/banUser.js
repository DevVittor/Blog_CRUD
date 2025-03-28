import { Types } from "mongoose";
import { z } from "zod";
import userModel from "../../../models/userModels.js";
import postModel from "../../../models/postModels.js";

const banUser = async (req, res) => {
  const bodySchema = z.object({
    adminId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    userId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
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
    const isAdmin = await userModel.findById(data.adminId).select("_id role");
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(400).json({ error: "Não foi possível prosseguir!" });
    }

    const userExist = await userModel.findById(data.userId).select("_id");
    if (!userExist) {
      return res
        .status(400)
        .json({ error: "Não foi possível localizar esse usuário" });
    }

    await postModel.deleteMany({ authorId: data.userId });
    await userModel.findByIdAndDelete(data.userId);
    return res.status(201).json({ msg: "Usuário banido com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível banir o usuário",
      details: error.message,
    });
  }
};

export default banUser;
