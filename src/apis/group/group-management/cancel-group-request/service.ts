import GroupRepository from "../../../../Repositories/group.repository";
const groupRepo = new GroupRepository();


const cancelGroupRequestService = async (requestId:number) => {
    const request = await groupRepo.cancelGroupRequest(requestId);
    return request;
}

export default cancelGroupRequestService;