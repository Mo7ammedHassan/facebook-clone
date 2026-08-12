import { Router } from "express";
import addFriendController from "./send-request/controller";
import { authenticate } from "../../middlewares/authentication";
import listFriendSentToMeRequestsController from "./list-friend-sent-to-me-requests/controller";
import acceptRequestController from "./accept-request/controller";
import cancelRequestController from "./cancel-request/controller";
import rejectRequestController from "./reject-request/controller";
import deleteFriendController from "./delete-friendship/controller";

const friendRouter = Router();

friendRouter.use(authenticate);

friendRouter.post("/request", addFriendController);

friendRouter.get(
  "/list-friends-requests",
  listFriendSentToMeRequestsController,
);

friendRouter.patch("/accept-request/:id", acceptRequestController);

friendRouter.patch("/cancel-request/:id", cancelRequestController);

friendRouter.patch("/reject-request/:id", rejectRequestController);

friendRouter.patch("/delete-friend/:id", deleteFriendController);

export default friendRouter;
