import ProfileRepository from "../../../../Repositories/profile.repository";

const profileRepo = new ProfileRepository();

const getMyProfileService = async (userId: number)=>{
    return await profileRepo.findProfileByUserId(userId);
};

export default getMyProfileService;