import ProfileRepository from "../../../../Repositories/profile.repository";
import updateProfileData from "./types";

const profileRepo=new ProfileRepository();
const updateProfileService = async (
  userId: number,
  data: updateProfileData,
) => {
    return await profileRepo.updateProfile(userId,data);
};

export default updateProfileService;