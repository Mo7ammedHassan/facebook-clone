export interface ICreateGroupService {
  name: string;
  ownerId: number;
  optional?: {
    description?: string;
    rules?: string;
    isOpen?: boolean;
    isPrivate?: boolean;
  };
  cover?: {
    publicId: string;
    fileName: string;
    filePath: string;
  };
}

export interface ICreateGroupController {
  name: string;
  ownerId: number;
  description?: string;
  rules?: string;
  isOpen?: boolean;
  isPrivate?: boolean;
  cover?: {
    publicId: string;
    fileName: string;
    filePath: string;
  };
}
