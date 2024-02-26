use clap::{App, Arg};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::path::PathBuf;
use tokio::fs;
use warp::{http::StatusCode, Filter, Rejection, Reply, reject, reply, body::json};

#[derive(Serialize, Deserialize)]
struct DirEntry {
    name: String,
    path: String,
    is_dir: bool,
}

// Additional struct for saving file content
#[derive(Deserialize)]
struct FileContent {
    content: String,
}

async fn handle_rejection(err: Rejection) -> Result<impl Reply, Rejection> {
    if err.is_not_found() {
        Ok(reply::with_status("Not Found", StatusCode::NOT_FOUND))
    } else {
        eprintln!("Unhandled error: {:?}", err);
        Ok(reply::with_status("Internal Server Error", StatusCode::INTERNAL_SERVER_ERROR))
    }
}

async fn list_directory(path: PathBuf) -> Result<impl Reply, Rejection> {
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

async fn get_file_content(path: PathBuf) -> Result<impl Reply, Rejection> {
    let content = fs::read_to_string(path).await.map_err(|_| reject::not_found())?;
    Ok(reply::json(&content))
}

async fn save_file_content(path: PathBuf, content: FileContent) -> Result<impl Reply, Rejection> {
    fs::write(path, content.content).await.map_err(|_| reject::not_found())?;
    Ok(reply::with_status("Content saved", StatusCode::OK))
}

#[tokio::main]
async fn main() {
    let matches = App::new("serveit")
        .version("1.0")
        .about("Serves files from a specified directory with directory listing and a React UI")
        .arg(Arg::with_name("directory")
            .index(1)
            .required(true)
            .help("The path to the directory to serve"))
        .arg(Arg::new("port")
            .short('p')
            .long("port")
            .takes_value(true)
            .default_value("3030")
            .help("Port to serve files on"))
        .get_matches();

    let directory = matches.value_of("directory").unwrap();
    let port: u16 = matches.value_of("port").unwrap().parse().expect("Port must be a number");

    let base_path = PathBuf::from(directory).canonicalize().expect("Invalid directory path");
    let webui_path = base_path.join("serveit-dashboard/build");

    let serve_dir = warp::path("files").and(warp::fs::dir(base_path.clone()));
    let serve_web_ui = warp::fs::dir(webui_path.clone());
    let serve_index = warp::get().and(warp::path::end()).and(warp::fs::file(webui_path.join("index.html")));

     // Clone `base_path` for each route closure where it's needed
     let base_path_for_list_dir = base_path.clone();
     let base_path_for_get_content = base_path.clone();
     let base_path_for_save_content = base_path; // This can consume `base_path` since it's the last usage
 
     let list_dir = warp::path("list")
         .and(warp::path::tail())
         .and_then(move |tail: warp::path::Tail| {
             let full_path = if tail.as_str().is_empty() {
                 base_path_for_list_dir.clone()
             } else {
                 base_path_for_list_dir.join(tail.as_str())
             };
             list_directory(full_path)
         });
 
     let get_content = warp::get()
         .and(warp::path("content"))
         .and(warp::path::tail())
         .and_then(move |tail: warp::path::Tail| {
             let full_path = base_path_for_get_content.join(tail.as_str());
             get_file_content(full_path)
         });
 
     let save_content = warp::post()
         .and(warp::path("content"))
         .and(warp::path::tail())
         .and(json())
         .and_then(move |tail: warp::path::Tail, content: FileContent| {
             let full_path = base_path_for_save_content.join(tail.as_str());
             save_file_content(full_path, content)
         });

    let cors = warp::cors()
        .allow_any_origin()
        .allow_headers(vec!["Content-Type"])
        .allow_methods(vec!["GET", "POST"]);

    let routes = serve_dir
        .or(list_dir)
        .or(serve_web_ui)
        .or(serve_index)
        .or(get_content)
        .or(save_content)
        .with(cors)
        .recover(handle_rejection);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!("Listening on http://{}", addr);
    warp::serve(routes).run(addr).await;
}