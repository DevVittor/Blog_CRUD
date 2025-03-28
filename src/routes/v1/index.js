import { Router } from "express";
const router = Router();

import User from "./userRoute.js";
import Post from "./postRoute.js";

router.use("/user", User);
router.use("/post", Post);

export default router;
