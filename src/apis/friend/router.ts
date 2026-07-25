import { Router } from "express";
import addFriendController from "./send-request/controller";
import { authenticate } from "../../middlewares/authentication";
import listFriendSentToMeRequestsController from "./list-friend-sent-to-me-requests/controller";
import acceptRequestController from "./accept-request/controller";

const friendRouter = Router();

friendRouter.use(authenticate);

friendRouter.post("/request", addFriendController);

friendRouter.get("/list-friends-requests", listFriendSentToMeRequestsController);

friendRouter.put("/accept-request/:id", acceptRequestController);

export default friendRouter;
