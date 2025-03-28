import "dotenv/config";
import express from "express";
const app = express();
import fs from "node:fs";
import { createServer } from "node:http";
const serverHTTP = createServer(app);

import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import admin from "../routes/v1/admin/index.js";
import router from "../routes/v1/index.js";
import conn from "../database/conn.js";
import corsConfig from "../config/corsConfig.js";
import rateLimitConfig from "../config/rateLimitConfig.js";
import createAdmin from "../utils/createAdmin.js";

const logStream = fs.createWriteStream("./src/logs/access.log", { flags: "a" });
morgan.token("json", (req, res) => {
  return JSON.stringify({
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    responseTime: res.responseTime,
    date: new Date().toISOString(),
  });
});
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(cookieParser());
app.use(rateLimitConfig);
app.use(helmet());
app.use(cors(corsConfig));
app.use(morgan(":json", { stream: logStream }));

app.disable("x-powered-by");

app.use("/", (req, _, next) => {
  console.log(`Method: ${req.method} | Path: ${req.path}`);
  next();
});

app.use("/admin", admin);
app.use("/api", router);

const port = process.env.PORT || 8080;

serverHTTP.listen(port, async () => {
  try {
    console.log(`Servidor rodando na porta ${port}.`);
    await conn();
    await createAdmin();
  } catch (error) {
    console.error(
      `Não foi possível conectar o servidor. \nError: ${error.message}`
    );
  }
});
