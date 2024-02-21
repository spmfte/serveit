use clap::{App, Arg};
use serde::{Deserialize, Serialize};
use std::{net::SocketAddr, path::PathBuf};
use tokio::fs;
use warp::{Filter, Rejection, Reply, http::StatusCode, reject};

#[derive(Serialize, Deserialize)]
struct DirEntry {
    name: String,
    path: String,
    is_dir: bool,
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
        .arg(Arg::with_name("port")
            .short('p')
            .long("port")
            .takes_value(true)
            .default_value("3030")
            .help("Port to serve files on"))
        .get_matches();

    let directory = matches.value_of("directory").unwrap();
    let port: u16 = matches.value_of("port").unwrap().parse().expect("Port must be a number");

    let base_path = PathBuf::from(directory).canonicalize().unwrap();
    let webui_path = base_path.join("webui/build");
    println!("Serving files from: {:?}", base_path);
    println!("Serving web UI from: {:?}", webui_path);

    let serve_dir = warp::path("files").and(warp::fs::dir(base_path.clone()));
    let serve_web_ui = warp::fs::dir(webui_path.clone());
    let serve_index = warp::get()
        .and(warp::path::end())
        .and(warp::fs::file(webui_path.join("index.html")));
    let list_dir = warp::path("list")
        .and(warp::path::param())
        .and_then(move |path: String| {
            let base_path = base_path.clone();
            async move {
                list_directory(base_path.join(path)).await
            }
        });

    let routes = serve_dir
        .or(list_dir)
        .or(serve_web_ui)
        .or(serve_index)
        .with(warp::cors().allow_any_origin())
        .recover(handle_rejection);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!("Listening on http://{}", addr);
    warp::serve(routes).run(addr).await;
}

async fn list_directory(path: PathBuf) -> Result<impl Reply, Rejection> {
    let mut entries = Vec::new();
    let mut read_dir = fs::read_dir(path).await.map_err(|_| reject::not_found())?;

    while let Ok(Some(entry)) = read_dir.next_entry().await {
        let path = entry.path();
        let metadata = entry.metadata().await.map_err(|_| reject::not_found())?;
        entries.push(DirEntry {
            name: entry.file_name().to_string_lossy().to_string(),
            path: path.to_string_lossy().to_string(),
            is_dir: metadata.is_dir(),
        });
    }
    Ok(warp::reply::json(&entries))
}

async fn handle_rejection(err: Rejection) -> Result<impl Reply, Rejection> {
    if err.is_not_found() {
        Ok(warp::reply::with_status("Not Found", StatusCode::NOT_FOUND))
    } else {
        eprintln!("handle_rejection - unhandled error: {:?}", err);
        Ok(warp::reply::with_status("Internal Server Error", StatusCode::INTERNAL_SERVER_ERROR))
    }
}

