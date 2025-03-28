import { z } from "zod";
import userModel from "../../../models/userModels.js";
import postModel from "../../../models/postModels.js";

const blockUser = async (req, res) => {
  const bodySchema = z.object({
    adminId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    userId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    reason: z.coerce.string(),
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

    const userCheck = await userModel.findById(data.userId);
    if (!userCheck || userCheck.blocked === true) {
      return res
        .status(403)
        .json({ error: "Não foi possível bloquear o usuário" });
    }

    await postModel.updateMany({ actived: true }, { $set: { actived: false } });
    await userModel.findByIdAndUpdate(
      data.userId,
      { $set: { blocked: true, reason: data.reason } },
      { new: true }
    );
    return res
      .status(201)
      .json({ msg: "Usuário bloqueado", reason: data.reason });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível bloquear o usuário",
      details: error.message,
    });
  }
};

export default blockUser;
