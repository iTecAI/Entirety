import { DBRecord } from "./db";

export interface Manifest extends DBRecord {
    name: string;
    lastOpened: number;
    version: string;
}

export interface Document extends DBRecord {
    name: string;
    tags: string[];
    icon?: string;
    parent: string | null;
    model: string;
    data: FormData;
}
