import "dotenv/config";
import bcrypt from "bcryptjs";
import userModel from "../models/userModels.js";

const createAdmin = async () => {
  try {
    const usernameDuplicate = await userModel
      .findOne({
        username: process.env.USERNAME_ADMIN || "Admin",
      })
      .select("_id username");
    if (usernameDuplicate) {
      return console.log("Já tem um alguém com esse nome.");
    }
    const adminExist = await userModel.findOne({
      $or: [
        { email: process.env.EMAIL_ADMIN || "exemplo@gmail.com" },
        { role: "admin" },
      ],
    });
    if (adminExist) {
      return console.log("Já tem uma conta admin cadastrada");
    }
    const myPassword = process.env.PASSWORD_ADMIN || "Senha123";
    const passwordWithHash = await bcrypt.hash(myPassword, 10);
    await userModel.create({
      username: process.env.USERNAME_ADMIN || "admin",
      email: process.env.EMAIL_ADMIN || "exemplo@gmail.com",
      password: passwordWithHash,
      role: "admin",
    });
    return console.log("Conta admin criada com sucesso!");
  } catch (error) {
    return console.error(
      `Não foi possível criar uma conta de admin. \nError: ${error.message}`
    );
  }
};

export default createAdmin;
