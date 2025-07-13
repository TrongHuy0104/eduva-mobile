import { EntityStatus } from '../enums/entity-status.enum';
import {
    ContentType,
    LessonMaterialStatus,
    LessonMaterialVisibility,
} from '../enums/lesson-material.enum';

export interface LessonMaterial {
    id: string;
    schoolId: number;
    title: string;
    description: string;
    contentType: ContentType;
    tag: string;
    lessonStatus: LessonMaterialStatus;
    duration: number;
    fileSize: number;
    isAIContent: boolean;
    sourceUrl: string;
    visibility: LessonMaterialVisibility;
    createdAt: string;
    lastModifiedAt: string | null;
    status: EntityStatus;
    createdById: string;
    createdByName: string;
}
