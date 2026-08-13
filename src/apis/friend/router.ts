import { Router } from "express";
import sendRequestController from "./send-request/controller";
import { authenticate } from "../../middlewares/authentication";
import receivedRequestsController from "./list-friend-sent-to-me-requests/controller";
import acceptRequestController from "./accept-request/controller";
import cancelRequestController from "./cancel-request/controller";
import rejectRequestController from "./reject-request/controller";
import deleteFriendController from "./delete-friendship/controller";
import listFriendsController from "./list-friends/controller";

const friendRouter = Router();

friendRouter.use(authenticate);

friendRouter.post("/request/send/:id", sendRequestController);

friendRouter.get("/request/received", receivedRequestsController);

friendRouter.patch("/request/accept/:id", acceptRequestController);

friendRouter.patch("/request/cancel/:id", cancelRequestController);

friendRouter.patch("/request/reject/:id", rejectRequestController);

friendRouter.patch("/friends/delete/:id", deleteFriendController);

friendRouter.get("/friends/list", listFriendsController);

export default friendRouter;
