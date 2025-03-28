import { Types } from "mongoose";
import { z } from "zod";
import userModel from "../../../models/userModels.js";

const listUser = async (req, res) => {
  const bodySchema = z.object({
    adminId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
  });
  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ errro: "Dados iválidos", details: bodyValidation.error.errors });
  }
  const { adminId } = bodyValidation.data;
  try {
    const isAdmin = await userModel.findById(adminId).select("_id role");
    if (!isAdmin || isAdmin.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Não tem permissão para prosseguir!" });
    }
    const countUser = await userModel.countDocuments();
    if (countUser <= 0) {
      return res
        .status(400)
        .json({ error: "Não tem nenhum usuários cadastrado no momento" });
    }
    const users = await userModel
      .find({ _id: { $ne: adminId } })
      .select(
        "_id postId username email role limit blocked createdAt updatedAt"
      );
    return res.status(200).json({ msg: "Lista de usuários", list: users });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível mostrar todos os usuários.",
      details: error.message,
    });
  }
};

export default listUser;
