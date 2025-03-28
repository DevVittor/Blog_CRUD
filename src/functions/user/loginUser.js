import "dotenv/config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import userModel from "../../models/userModels.js";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "fall";

const loginUser = async (req, res) => {
  const bodySchema = z.object({
    email: z.coerce.string().email(),
    password: z.coerce.string().min(6).max(16),
  });
  const bodyValidation = bodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos", details: bodyValidation.error.errors });
  }

  const { ...data } = bodyValidation.data;
  try {
    const newEmail = await userModel
      .findOne({ email: data.email })
      .select("_id role email blocked password");
    if (!newEmail || newEmail.blocked === true) {
      return res
        .status(409)
        .json({ error: "Não foi possível acessar a conta." });
    }
    const verifyPassword = await bcrypt.compare(
      data.password,
      newEmail.password
    );
    if (!verifyPassword) {
      return res
        .status(409)
        .json({ error: "Não foi possível acessar a conta." });
    }
    const payload = {
      _id: newEmail._id,
      email: newEmail.email,
      role: newEmail.role,
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
      .status(200)
      .cookie("access_token", `Bearer ${token}`, cookieOptions)
      .json({ msg: "Acesso permitido", token });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível autentificar o usuários.",
      details: error.message,
    });
  }
};

export default loginUser;
