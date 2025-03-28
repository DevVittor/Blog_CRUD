import { Types } from "mongoose";
import { z } from "zod";
import postModel from "../../models/postModels.js";

const detailsPost = async (req, res) => {
  const querySchema = z.object({
    postId: z.coerce.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Id inválido",
    }),
  });
  const queryValidation = querySchema.safeParse(req.query);
  if (!queryValidation.success) {
    return res
      .status(400)
      .jso({ error: "Dados inválidos", details: queryValidation.error.errors });
  }
  const { postId } = queryValidation.data;
  try {
    const searchPost = await postModel
      .findById(postId)
      .select("_id author title content categories createdAt updatedAt");
    if (!searchPost || searchPost.actived === false) {
      return res
        .status(403)
        .json({ error: "Não foi possível mostrar detalhes do post" });
    }
    return res
      .status(200)
      .json({ msg: "Detalhes do post", details: searchPost });
  } catch (error) {
    return res.status(400).json({
      error: "Não foi possível mostrar detalhes do post.",
      details: error.message,
    });
  }
};

export default detailsPost;
