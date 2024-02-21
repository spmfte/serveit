use clap::{App, Arg};
use std::{path::PathBuf, convert::Infallible, net::SocketAddr};
use warp::{Filter, http::Response, fs::File};
use tokio::fs;
use serde::{Serialize, Deserialize};

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
        .arg(Arg::new("directory")
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

    let base_path = PathBuf::from(directory).canonicalize().unwrap();
    let webui_path = base_path.join("webui/build"); // Assuming your React build folder is located here
    println!("Serving files from: {:?}", base_path);
    println!("Serving web UI from: {:?}", webui_path);

    let serve_dir = warp::path("files").and(warp::fs::dir(base_path.clone()));
    let serve_web_ui = warp::fs::dir(webui_path.clone());
    let list_dir = warp::path("list")
        .and(warp::path::param::<String>())
        .and_then(move |path: String| {
            let base_path = base_path.clone();
            async move {
                let full_path = base_path.join(path);
                list_directory(full_path).await
            }
        });

    // Combine serving the directory listing, static files, and the React app
    let routes = serve_dir.or(list_dir).or(serve_web_ui);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!("Listening on http://{}", addr);
    warp::serve(routes).run(addr).await;
}

async fn list_directory(path: PathBuf) -> Result<impl warp::Reply, Infallible> {
    let mut entries = Vec::new();
    let read_dir = fs::read_dir(path).await;

    match read_dir {
        Ok(dir) => {
            for entry in dir {
                if let Ok(entry) = entry.await {
                    let path = entry.path();
                    let metadata = entry.metadata().await.unwrap();
                    entries.push(DirEntry {
                        name: entry.file_name().to_string_lossy().to_string(),
                        path: path.to_string_lossy().to_string(),
                        is_dir: metadata.is_dir(),
                    });
                }
            }
        },
        Err(_) => return Ok(Response::builder().status(404).body("Directory not found".into()).unwrap()),
    }

    Ok(warp::reply::json(&entries))
}

