use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct DirEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
}

#[derive(Deserialize)]
pub struct FileContent {
    pub content: String,
}