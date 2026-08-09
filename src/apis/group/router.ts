import { Router } from "express";
import createGroupController from "./group-management/create-group/controller";
import upload from "../../middlewares/storage-multer";
import { authenticate } from "../../middlewares/authentication";
import createPostController from "./posts/create-post/controller";
import requestJoinToGroupController from "./group-management/request-join-to group/controller";
import listRequestsJoinToGroupController from "./group-management/list-requests-join-to-group/controller";
import updateGroupRequestStatusController from "./group-management/update-group-request-status/controller";

const groupRouter = Router();

groupRouter.use(authenticate);

groupRouter.post("/create", upload.single("cover"), createGroupController);

groupRouter.post(
  "/:groupId/posts/create",
  upload.array("images", 30),
  createPostController,
);

groupRouter.get("/:groupId/request-join", requestJoinToGroupController);

groupRouter.get(
  "/:groupId/list-requests-join",
  listRequestsJoinToGroupController,
);

groupRouter.patch(
  "/:groupId/requests-join/:requestId",
  updateGroupRequestStatusController,
);

export default groupRouter;
