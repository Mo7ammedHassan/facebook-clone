BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [publicId] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [isPrivate] BIT NOT NULL CONSTRAINT [User_isPrivate_df] DEFAULT 0,
    [isEmailVerified] BIT NOT NULL CONSTRAINT [User_isEmailVerified_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [imageId] INT,
    [updatedAt] DATETIME2 NOT NULL,
    [profileId] INT NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_publicId_key] UNIQUE NONCLUSTERED ([publicId]),
    CONSTRAINT [User_name_key] UNIQUE NONCLUSTERED ([name]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [User_imageId_key] UNIQUE NONCLUSTERED ([imageId]),
    CONSTRAINT [User_profileId_key] UNIQUE NONCLUSTERED ([profileId])
);

-- CreateTable
CREATE TABLE [dbo].[Profile] (
    [id] INT NOT NULL IDENTITY(1,1),
    [bio] NVARCHAR(1000),
    [gender] NVARCHAR(1000),
    [dateOfBirth] DATETIME2 NOT NULL,
    [city] NVARCHAR(1000),
    [country] NVARCHAR(1000),
    [school] NVARCHAR(1000),
    [education] NVARCHAR(1000),
    [work] NVARCHAR(1000),
    [userId] INT NOT NULL,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Profile_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Profile_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[image] (
    [id] INT NOT NULL IDENTITY(1,1),
    [publicId] NVARCHAR(1000) NOT NULL,
    [fileName] NVARCHAR(1000) NOT NULL,
    [filePath] NVARCHAR(1000) NOT NULL,
    [orderIndex] INT NOT NULL CONSTRAINT [image_orderIndex_df] DEFAULT 1,
    [description] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [image_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [image_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [image_publicId_key] UNIQUE NONCLUSTERED ([publicId])
);

-- CreateTable
CREATE TABLE [dbo].[Post] (
    [id] INT NOT NULL IDENTITY(1,1),
    [content] NVARCHAR(1000) NOT NULL,
    [groupId] INT,
    [loveCount] INT NOT NULL CONSTRAINT [Post_loveCount_df] DEFAULT 0,
    [hahaCount] INT NOT NULL CONSTRAINT [Post_hahaCount_df] DEFAULT 0,
    [eggCount] INT NOT NULL CONSTRAINT [Post_eggCount_df] DEFAULT 0,
    [wowCount] INT NOT NULL CONSTRAINT [Post_wowCount_df] DEFAULT 0,
    [sadCount] INT NOT NULL CONSTRAINT [Post_sadCount_df] DEFAULT 0,
    [angryCount] INT NOT NULL CONSTRAINT [Post_angryCount_df] DEFAULT 0,
    [commentCount] INT NOT NULL CONSTRAINT [Post_commentCount_df] DEFAULT 0,
    [shareCount] INT NOT NULL CONSTRAINT [Post_shareCount_df] DEFAULT 0,
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Post_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [isPrivate] BIT NOT NULL CONSTRAINT [Post_isPrivate_df] DEFAULT 0,
    [DeletedAt] DATETIME2,
    [type] NVARCHAR(1000) NOT NULL CONSTRAINT [Post_type_df] DEFAULT 'Normal',
    [parentPostId] INT,
    [commentOnPost] NVARCHAR(1000),
    CONSTRAINT [Post_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Group] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [rules] NVARCHAR(1000),
    [coverId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Group_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Group_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Group_coverId_key] UNIQUE NONCLUSTERED ([coverId])
);

-- CreateTable
CREATE TABLE [dbo].[membersOfGroup] (
    [id] INT NOT NULL IDENTITY(1,1),
    [groupId] INT NOT NULL,
    [userId] INT NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [membersOfGroup_role_df] DEFAULT 'member',
    [joinedAt] DATETIME2 NOT NULL CONSTRAINT [membersOfGroup_joinedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [membersOfGroup_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [membersOfGroup_groupId_userId_key] UNIQUE NONCLUSTERED ([groupId],[userId])
);

-- CreateTable
CREATE TABLE [dbo].[React] (
    [id] INT NOT NULL IDENTITY(1,1),
    [postId] INT NOT NULL,
    [userId] INT NOT NULL,
    [reactType] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [React_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [React_postId_userId_key] UNIQUE NONCLUSTERED ([postId],[userId])
);

-- CreateTable
CREATE TABLE [dbo].[Comment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [postId] INT NOT NULL,
    [userId] INT NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [imageId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Comment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Comment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Friends] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [friendId] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Friends_status_df] DEFAULT 'pending',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Friends_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Friends_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[savedPosts] (
    [id] INT NOT NULL IDENTITY(1,1),
    [postId] INT NOT NULL,
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [savedPosts_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [savedPosts_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[loginSession] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [refreshToken] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [loginSession_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [loginSession_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[GroupRequests] (
    [id] INT NOT NULL IDENTITY(1,1),
    [groupId] INT NOT NULL,
    [userId] INT NOT NULL,
    [targetType] NVARCHAR(1000) NOT NULL,
    [targetId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [GroupRequests_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [GroupRequests_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Notifications] (
    [id] INT NOT NULL IDENTITY(1,1),
    [recipientId] INT NOT NULL,
    [actorId] INT NOT NULL,
    [actionType] NVARCHAR(1000) NOT NULL,
    [entityType] NVARCHAR(1000) NOT NULL,
    [entityId] INT NOT NULL,
    [content] NVARCHAR(1000),
    [isRead] BIT NOT NULL CONSTRAINT [Notifications_isRead_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Notifications_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Notifications_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PostImage] (
    [id] INT NOT NULL IDENTITY(1,1),
    [postId] INT NOT NULL,
    [imageId] INT NOT NULL,
    CONSTRAINT [PostImage_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_imageId_fkey] FOREIGN KEY ([imageId]) REFERENCES [dbo].[image]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Profile] ADD CONSTRAINT [Profile_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Post] ADD CONSTRAINT [Post_groupId_fkey] FOREIGN KEY ([groupId]) REFERENCES [dbo].[Group]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Post] ADD CONSTRAINT [Post_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Post] ADD CONSTRAINT [Post_parentPostId_fkey] FOREIGN KEY ([parentPostId]) REFERENCES [dbo].[Post]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Group] ADD CONSTRAINT [Group_coverId_fkey] FOREIGN KEY ([coverId]) REFERENCES [dbo].[image]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[membersOfGroup] ADD CONSTRAINT [membersOfGroup_groupId_fkey] FOREIGN KEY ([groupId]) REFERENCES [dbo].[Group]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[membersOfGroup] ADD CONSTRAINT [membersOfGroup_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[React] ADD CONSTRAINT [React_postId_fkey] FOREIGN KEY ([postId]) REFERENCES [dbo].[Post]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[React] ADD CONSTRAINT [React_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Comment] ADD CONSTRAINT [Comment_postId_fkey] FOREIGN KEY ([postId]) REFERENCES [dbo].[Post]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Comment] ADD CONSTRAINT [Comment_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Comment] ADD CONSTRAINT [Comment_imageId_fkey] FOREIGN KEY ([imageId]) REFERENCES [dbo].[image]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Friends] ADD CONSTRAINT [Friends_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Friends] ADD CONSTRAINT [Friends_friendId_fkey] FOREIGN KEY ([friendId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[savedPosts] ADD CONSTRAINT [savedPosts_postId_fkey] FOREIGN KEY ([postId]) REFERENCES [dbo].[Post]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[savedPosts] ADD CONSTRAINT [savedPosts_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[loginSession] ADD CONSTRAINT [loginSession_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[GroupRequests] ADD CONSTRAINT [GroupRequests_groupId_fkey] FOREIGN KEY ([groupId]) REFERENCES [dbo].[Group]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[GroupRequests] ADD CONSTRAINT [GroupRequests_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Notifications] ADD CONSTRAINT [Notifications_recipientId_fkey] FOREIGN KEY ([recipientId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Notifications] ADD CONSTRAINT [Notifications_actorId_fkey] FOREIGN KEY ([actorId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PostImage] ADD CONSTRAINT [PostImage_postId_fkey] FOREIGN KEY ([postId]) REFERENCES [dbo].[Post]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PostImage] ADD CONSTRAINT [PostImage_imageId_fkey] FOREIGN KEY ([imageId]) REFERENCES [dbo].[image]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
