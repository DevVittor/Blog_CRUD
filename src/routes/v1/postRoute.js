import { Router } from "express";
const router = Router();

import detailsPost from "../../functions/post/detailsPost.js";
import createPost from "../../functions/post/createPost.js";
import alterTitle from "../../functions/post/alterTitle.js";
import alterContent from "../../functions/post/alterContent.js";
import deletePost from "../../functions/post/deletePost.js";

router.get("/details", detailsPost);
router.post("/create", createPost);
router.patch("/alter/title", alterTitle);
router.patch("/alter/content", alterContent);
router.delete("/delete", deletePost);

export default router;
