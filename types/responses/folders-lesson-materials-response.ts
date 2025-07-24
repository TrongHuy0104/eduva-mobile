import { LessonMaterial } from '../models/lesson-material.model';

export interface FoldersLessonMaterialsResponse {
    id: string;
    name: string;
    countLessonMaterials: number;
    lessonMaterials: LessonMaterial[];
}
