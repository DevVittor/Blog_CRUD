import { Router } from "express";
const router = Router();

import listPost from "../../../functions/admin/post/listPost.js";
import blockPost from "../../../functions/admin/post/blockPost.js";
import banPost from "../../../functions/admin/post/banPost.js";

router.get("/list", listPost);
router.patch("/block", blockPost);
router.delete("/ban", banPost);

export default router;
