import { Router } from "express";
const router = Router();

import registerUser from "../../functions/user/registerUser.js";
import loginUser from "../../functions/user/loginUser.js";
import alterEmail from "../../functions/user/alterEmail.js";
import alterPassword from "../../functions/user/alterPassword.js";
import deleteUser from "../../functions/user/deleteUser.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/alter/email", alterEmail);
router.patch("/alter/password", alterPassword);
router.delete("/delete", deleteUser);

export default router;
