use clap::{App, Arg};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::path::PathBuf;
use tokio::fs;
use warp::{http::StatusCode, Filter, Rejection, Reply, reject, reply};

#[derive(Serialize, Deserialize)]
struct DirEntry {
    name: String,
    path: String,
    is_dir: bool,
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

    // Log serving paths
    println!("Serving files from: {:?}", base_path);
    println!("Serving web UI from: {:?}", webui_path);

    // Define routes
    let serve_dir = warp::path("files").and(warp::fs::dir(base_path.clone()));
    let serve_web_ui = warp::fs::dir(webui_path.clone());
    let serve_index = warp::get().and(warp::path::end()).and(warp::fs::file(webui_path.join("index.html")));

    let list_dir = warp::path("list")
        .and(warp::path::tail())
        .and_then(move |tail: warp::path::Tail| {
            let base_path_clone = base_path.clone(); // Clone base_path for use in closure
            let path_suffix = tail.as_str();
            let full_path = if path_suffix.is_empty() {
                base_path_clone.clone()
            } else {
                base_path_clone.join(path_suffix)
            };
            list_directory(full_path)
        });

    // Set up CORS
    let cors = warp::cors()
        .allow_any_origin()
        .allow_headers(vec!["Content-Type"])
        .allow_methods(vec!["GET"]);

    // Combine routes
    let routes = serve_dir
        .or(list_dir)
        .or(serve_web_ui)
        .or(serve_index)
        .with(cors)
        .recover(handle_rejection);

    // Start server
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!("Listening on http://{}", addr);
    warp::serve(routes).run(addr).await;
}