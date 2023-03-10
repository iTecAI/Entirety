import { DBRecord } from "./db";

export interface Manifest extends DBRecord {
    name: string;
    lastOpened: number;
    version: string;
}
