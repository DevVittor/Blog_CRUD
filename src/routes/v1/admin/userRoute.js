import { Router } from "express";
const router = Router();

import listUser from "../../../functions/admin/user/listUser.js";
import blockUser from "../../../functions/admin/user/blockUser.js";
import banUser from "../../../functions/admin/user/banUser.js";

router.get("/list", listUser);
router.patch("/block", blockUser);
router.delete("/ban", banUser);

export default router;
