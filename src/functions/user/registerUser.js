import "dotenv/config";
import { z } from "zod";
import userModel from "../../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "fall";

const registerUser = async (req, res) => {
  const bodySchema = z.object({
    username: z.coerce.string(),
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
    const dataDuplicate = await userModel
      .findOne({ email: data.email })
      .select("_id");
    if (dataDuplicate) {
      return res
        .status(403)
        .json({ error: "Não foi possível fazer o cadastro do usuário." });
    }

    const createPasswordWithHash = await bcrypt.hash(data.password, 10);

    const newUser = await userModel.create({
      username: data.username,
      email: data.email,
      password: createPasswordWithHash,
      limit: 5,
    });

    const payload = {
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
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
      .json({ msg: "Usuário criado com sucesso!", token });
  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível criar uma conta no momento.",
      details: error.message,
    });
  }
};

export default registerUser;
