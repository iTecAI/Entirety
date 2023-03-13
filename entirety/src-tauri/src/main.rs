// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn request_scope(folder: String, app_handle: tauri::AppHandle) -> bool {
    app_handle.fs_scope().allow_directory(folder, true).is_ok()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_persisted_scope::init())
        .invoke_handler(tauri::generate_handler![request_scope])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
