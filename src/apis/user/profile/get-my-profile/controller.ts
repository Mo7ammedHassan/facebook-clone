import { catchError } from "../../../../utils/catch-error";
import getMyProfileService from "./service";

const getMyProfileController = catchError(async (req, res) => {
   
  const userId = +req.user.id;
  const profile = await getMyProfileService(userId);
  return res.status(200).json({ success: true,data:profile });
});

export default getMyProfileController;