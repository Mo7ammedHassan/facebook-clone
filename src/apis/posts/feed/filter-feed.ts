import prisma from "../../../config/prisma-client.config"; 

const filterFeed = (posts: any[], currentUserId: number, myFriendIds: number[], myGroupIds: number[]) => {
   return posts.filter((post : any) => {
      // this post is not shared
      if(post.type!=="shared"&&!post.parentPostId) 
         return true;

      const originalPost =post.parentPostId;
      // this post is shared by my friend from a private group and i am not a member in the group
      if(originalPost.groupId&&originalPost.group?.isPrivate){
         const amIMember = myGroupIds.includes(originalPost.groupId);
         if(!amIMember) 
         return false;
      }
      // this post is shared by my friend from private user and this user is not friend fot me
      if(originalPost.isPrivate){
        const isOriginalAuthorMyFriend = myFriendIds.includes(originalPost.userId);
        const isMe = originalPost.userId === currentUserId;  
        if(!isOriginalAuthorMyFriend && !isMe){
           return false;
        }
      return true;
      }
   });
};

export default filterFeed;