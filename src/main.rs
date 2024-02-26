mod models;
mod file_operations;
mod errors;

use clap::{App, Arg};
use std::net::SocketAddr;
use std::path::PathBuf;
use warp::{Filter, filters::body::json};
use crate::file_operations::{list_directory, get_file_content, save_file_content};
use crate::errors::handle_rejection;

#[tokio::main]
async fn main() {
    let matches = App::new("My Rust Web Server")
        .version("1.0")
        .about("Serves files and directories")
        .arg(Arg::new("port")
            .short('p')
            .long("port")
            .takes_value(true)
            .help("Port to run the server on"))
        .arg(Arg::new("directory")
            .short('d')
            .long("directory")
            .takes_value(true)
            .help("The directory to serve files from"))
        .get_matches();

    let port = matches.value_of("port").unwrap_or("3030").parse::<u16>().expect("Port must be a number");
    let directory = matches.value_of("directory").unwrap_or(".").to_string();

    let base_path = PathBuf::from(directory);

    // Clone `base_path` for each closure where it's needed
    let base_path_for_list_dir = base_path.clone();
    let base_path_for_get_content = base_path.clone();
    // No need to clone for the last usage
    let base_path_for_save_content = base_path; 

    let list_dir_route = warp::path("list")
        .and(warp::path::tail())
        .and_then(move |tail: warp::path::Tail| {
            let full_path = if tail.as_str().is_empty() {
                base_path_for_list_dir.clone()
            } else {
                base_path_for_list_dir.join(tail.as_str())
            };
            list_directory(full_path)
        });

    let get_content_route = warp::path("content")
        .and(warp::path::tail())
        .and_then(move |tail: warp::path::Tail| {
            let full_path = base_path_for_get_content.join(tail.as_str());
            get_file_content(full_path)
        });

    let save_content_route = warp::path("content")
        .and(warp::path::tail())
        .and(json())
        .and_then(move |tail: warp::path::Tail, content: models::FileContent| {
            let full_path = base_path_for_save_content.join(tail.as_str());
            save_file_content(full_path, content)
        });

    let routes = list_dir_route
        .or(get_content_route)
        .or(save_content_route)
        .recover(handle_rejection);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!("Serving on http://{}", addr);

    warp::serve(routes)
        .run(addr)
        .await;
}