import { Types } from "mongoose";
import { z } from "zod";
import userModel from "../../models/userModels.js";

const deleteUser = async (req, res) => {
  const bodySchema = z.object({
    userId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
  });
  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ errro: "Dados iválidos", details: bodyValidation.error.errors });
  }
  const { userId } = bodyValidation.data;
  try {
    const userExist = await userModel.findById(userId).select("_id");
    if (!userExist) {
      return res
        .status(400)
        .json({ error: "Não foi possível deletar a conta" });
    }
    await userModel.findByIdAndDelete(userId);
    return res.status(201).json({ msg: "Usuário deletado" });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível deletar a conta",
      details: error.message,
    });
  }
};

export default deleteUser;
