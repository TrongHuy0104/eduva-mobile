import { FolderOwnerType } from '../enums/folder-owner-type.enum';

export interface Folder {
    id: string;
    name: string;
    userId?: string;
    classId?: string;
    ownerName: string;
    ownerType: FolderOwnerType;
    order: number;
    createdAt: string;
    lastModifiedAt: string;
    countLessonMaterial: number;
}
