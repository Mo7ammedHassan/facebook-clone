import { Router } from "express";
import createGroupController from "./create-group/controller";
import upload from "../../middlewares/storage-multer";
import { authenticate } from "../../middlewares/authentication";
import createPostController from "./posts/create-post/controller";

const groupRouter = Router();

groupRouter.use(authenticate);

groupRouter.post(
  "/posts/create",
  upload.array("images", 30),
  createPostController,
);

groupRouter.post("/create", upload.single("cover"), createGroupController);

export default groupRouter;
