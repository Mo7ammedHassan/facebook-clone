import { Router } from "express";
import sendRequestController from "./send-request/controller";
import { authenticate } from "../../middlewares/authentication";
import receivedRequestsController from "./received-requests/controller";
import acceptRequestController from "./accept-request/controller";
import cancelRequestController from "./cancel-request/controller";
import rejectRequestController from "./reject-request/controller";
import deleteFriendController from "./delete-friendship/controller";
import listFriendsController from "./list-friends/controller";
import sentRequestsController from "./sent-requests/controller";
import getFriendshipStatusController from "./get-friendship-status/controller";

const friendRouter = Router();

friendRouter.use(authenticate);

// --- Friend Requests ---

friendRouter.post("/requests/send/:id", sendRequestController);

friendRouter.get("/requests/received", receivedRequestsController);

friendRouter.get("/requests/sent", sentRequestsController);

friendRouter.patch("/requests/accept/:id", acceptRequestController);

friendRouter.delete("/requests/cancel/:id", cancelRequestController);

friendRouter.patch("/requests/reject/:id", rejectRequestController);

// --- Friendship & Relationships ---

friendRouter.delete("/:id", deleteFriendController);

friendRouter.get("/status/:id", getFriendshipStatusController);

friendRouter.get("/list", listFriendsController);

export default friendRouter;
