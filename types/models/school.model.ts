import { EntityStatus } from '../enums/entity-status.enum';

export interface School {
    id: number;
    name: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    websiteUrl?: string;
    status: EntityStatus;
}
