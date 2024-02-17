use clap::{App, Arg};
use std::{path::PathBuf};
use warp::{Filter, http::Response, reject, Rejection, Reply};

// Define a custom error type to handle non-HTTP errors
#[derive(Debug)]
struct InternalError(String);
impl warp::reject::Reject for InternalError {}

async fn list_directory(base_path: PathBuf) -> Result<impl Reply, Rejection> {
    let mut entries = Vec::new();
    let read_dir = match std::fs::read_dir(&base_path) {
        Ok(dir) => dir,
        Err(e) => return Err(reject::custom(InternalError(e.to_string()))),
    };
    for entry in read_dir.filter_map(Result::ok) {
        let path = entry.path();
        if let Some(filename) = path.file_name().and_then(|n| n.to_str()) {
            let url_encoded_path = urlencoding::encode(filename);
            entries.push(format!("<li><a href='/files/{}'>{}</a></li>", url_encoded_path, filename));
        }
    }
    let body = format!("<html><body><ul>{}</ul></body></html>", entries.join(""));
    Ok(Response::builder().body(body).unwrap())
}

#[tokio::main]
async fn main() {
    let matches = App::new("serveit")
        .version("1.0")
        .about("Serves files from a specified directory with directory listing")
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

    let directory = matches.value_of("directory").unwrap(); // Safe due to .required(true)
    let port: u16 = matches.value_of("port").unwrap().parse().expect("Port must be a number");

    let base_path = PathBuf::from(directory);
    println!("Serving files from: {:?}", base_path);

    let serve_dir = warp::path("files").and(warp::fs::dir(base_path.clone()));

    let list_dir_path = base_path.clone();
    let list_dir = warp::path("list").and_then(move || list_directory(list_dir_path.clone()));

    let routes = serve_dir.or(list_dir);

    warp::serve(routes).run(([0, 0, 0, 0], port)).await;
}

