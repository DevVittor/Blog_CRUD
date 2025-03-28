import { Types } from "mongoose";
import { z } from "zod";
import bcrypt from "bcryptjs";
import userModel from "../../models/userModels.js";

const alterPassword = async (req, res) => {
  const bodySchema = z.object({
    userId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    newPassword: z.coerce.string().min(6).max(16),
  });
  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ errro: "Dados iválidos", details: bodyValidation.error.errors });
  }
  const { ...data } = bodyValidation.data;
  try {
    const userExist = await userModel
      .findById(data.userId)
      .select("_id blocked password");
    if (!userExist || userExist.blocked === true) {
      return res
        .status(403)
        .json({ error: "Não foi possível localizar alterar o email" });
    }
    const equalPassword = await bcrypt.compare(
      data.newPassword,
      userExist.password
    );
    if (equalPassword) {
      return res
        .status(403)
        .json({ error: "Coloque uma senha diferente da atual" });
    }
    const createPasswordWithHash = await bcrypt.hash(data.password, 10);
    await userModel.findByIdAndUpdate(
      data.userId,
      {
        $set: { password: createPasswordWithHash },
      },
      { new: true }
    );
    return res.status(201).json({ msg: "Senha alterada" });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível alterar a senha no momento.",
      details: error.message,
    });
  }
};

export default alterPassword;
