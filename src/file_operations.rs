use crate::models::{DirEntry, FileContent};
use std::path::PathBuf;
use tokio::fs;
use warp::{reject, reply, Rejection, Reply};
use warp::http::StatusCode;



pub async fn list_directory(path: PathBuf) -> Result<impl Reply, Rejection> {
    let mut read_dir = fs::read_dir(path).await.map_err(|_| reject::not_found())?;
    let mut entries = Vec::new();

    while let Ok(Some(entry)) = read_dir.next_entry().await {
        let path = entry.path();
        let metadata = entry.metadata().await.map_err(|_| reject::not_found())?;
        entries.push(DirEntry {
            name: entry.file_name().to_string_lossy().to_string(),
            path: path.to_string_lossy().to_string(),
            is_dir: metadata.is_dir(),
        });
    }

    Ok(reply::json(&entries))
}

pub async fn get_file_content(path: PathBuf) -> Result<impl Reply, Rejection> {
    let content = fs::read_to_string(path).await.map_err(|_| reject::not_found())?;
    Ok(reply::json(&content))
}

pub async fn save_file_content(path: PathBuf, content: FileContent) -> Result<impl Reply, Rejection> {
    fs::write(path, content.content).await.map_err(|_| reject::not_found())?;
    Ok(reply::with_status("Content saved", StatusCode::OK))
}
