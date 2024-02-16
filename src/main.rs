use clap::{App, Arg};
use std::path::PathBuf;
use warp::Filter;

#[tokio::main]
async fn main() {
    let matches = App::new("serveit")
        .version("1.0")
        .about("Serves files from a specified directory")
        .arg(Arg::with_name("directory")
             .help("The path to the directory to serve")
             .required(true)
             .index(1))
        .get_matches();

    let base_path: PathBuf = matches.value_of("directory").unwrap().into();

    let files = warp::path("files").and(warp::fs::dir(base_path.clone()));

    println!("Serving files from: {:?}", base_path);
    println!("Server running on http://127.0.0.1:5001");

    warp::serve(files)
        .run(([127, 0, 0, 1], 5001))
        .await;
}

