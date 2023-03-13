import { invoke } from "@tauri-apps/api/tauri";

export function requestScope(directory: string): Promise<boolean> {
    return invoke<boolean>("request_scope", { folder: directory });
}
