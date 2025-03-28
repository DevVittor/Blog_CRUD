import "dotenv/config";
import mongoose from "mongoose";

const mongoURL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/";
const mongoNAME = process.env.MONGO_NAME || "Blog";

const conn = async () => {
  try {
    await mongoose.connect(mongoURL, {
      dbName: mongoNAME,
    });
    console.log("Banco de dados sincronizado com sucesso!");
  } catch (error) {
    console.error(
      `Não foi possível se conectar ao banco de dados. \nError: ${error.message}`
    );
  }
};

export default conn;
