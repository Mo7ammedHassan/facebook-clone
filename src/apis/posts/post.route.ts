import { Router } from "express";
import createPostController from "./create-post/controller";
import { authenticate } from "../../middlewares/authentication";
import upload from "../../middlewares/storage-multer";
import feedController from "./feed/controller";


const postRouter= Router();

postRouter.use(authenticate);

postRouter.post("/create",upload.array("images",30), createPostController);

postRouter.get("/feed",feedController);

export default postRouter