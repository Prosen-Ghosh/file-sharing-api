import { StorageType } from "src/common/enums/StorageType.enum";

export interface IFile {
    name: string;
    publicKey: string;
    privateKey: string;
    path: string;
    provider: StorageType;
    lastVisited?: Date;
    updatedAt?: Date;
    createdAt?: Date;
}

