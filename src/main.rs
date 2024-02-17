use clap::{App, Arg};
use std::path::PathBuf;
use warp::Filter;

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

    // Ensure the base_path is absolute and resolve any potential symlink
    let base_path = if base_path.is_relative() {
        std::env::current_dir().unwrap().join(base_path)
    } else {
        base_path.canonicalize().unwrap()
    };

    let serve_dir = warp::path("files").and(warp::fs::dir(base_path.clone()));
    let routes = serve_dir;

    println!("Listening on http://127.0.0.1:{}", port);
    warp::serve(routes).run(([127, 0, 0, 1], port)).await;
}

