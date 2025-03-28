import "dotenv/config";
import { Types } from "mongoose";
import { z } from "zod";
import userModel from "../../models/userModels.js";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "fall";

const alterEmail = async (req, res) => {
  const bodySchema = z.object({
    userId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
    newEmail: z.coerce.string().email(),
  });
  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }
  const { ...data } = bodyValidation.data;
  try {
    const userExist = await userModel
      .findById(data.userId)
      .select("_id email blocked");
    if (!userExist || userExist.blocked === true) {
      return res
        .status(403)
        .json({ error: "Não foi possível localizar alterar o email" });
    }

    const emailDuplicate = await userModel
      .findOne({ email: date.newEmail })
      .select("_id email role");
    if (emailDuplicate) {
      return res
        .status(403)
        .json({ error: "Não foi possível localizar alterar o email" });
    }
    if (emailDuplicate.email === data.newEmail) {
      return res
        .status(403)
        .json({ error: "Não foi possível localizar alterar o email" });
    }

    await userModel.findByIdAndUpdate(
      data.userId,
      {
        $set: { email: data.newEmail },
      },
      { new: true }
    );
    const payload = {
      _id: emailDuplicate._id,
      email: data.newEmail,
      role: emailDuplicate.role,
    };
    const token = jwt.sign(payload, secret, {
      expiresIn: "7d",
    });
    const sevenDays = 1000 * 60 * 60 * 24 * 7;

    const cookieOptions = {
      httpOnly: true,
      secure: false,
      maxAge: sevenDays,
      path: "/",
    };

    return res
      .status(201)
      .cookie("access_token", `Bearer ${token}`, cookieOptions)
      .json({ msg: "Email alterado!", token });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível alterar o email no momento",
      details: error.message,
    });
  }
};

export default alterEmail;
