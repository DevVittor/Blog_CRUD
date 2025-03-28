import { Router } from "express";
const router = Router();

import User from "./userRoute.js";

router.use("/user", User);

export default router;
