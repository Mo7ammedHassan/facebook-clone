
import GroupRepository from "../../../Repositories/group.repository";
import { ICreateGroupService } from "./types";


const groupRepo=new GroupRepository();

const createGroupService=async(data:ICreateGroupService)=>{
   return await groupRepo.createGroup(data);
}

export default createGroupService