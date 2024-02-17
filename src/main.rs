use clap::{App, Arg};
use std::path::PathBuf;
use warp::Filter;
use warp::http::Response;

#[tokio::main]
async fn main() {
    let matches = App::new("serveit")
        .version("1.0")
        .about("Serves files from a specified directory with directory listing")
        .arg(Arg::with_name("directory")
            .short('d')
            .long("directory")
            .takes_value(true)
            .help("The path to the directory to serve"))
        .arg(Arg::with_name("port")
            .short('p')
            .long("port")
            .takes_value(true)
            .default_value("3030")
            .help("Port to serve files on"))
        .get_matches();

    let directory = matches.value_of("directory").unwrap_or(".");
    let port = matches.value_of("port").unwrap().parse::<u16>().expect("Port must be a number");

    let base_path = PathBuf::from(directory);
    println!("Serving files from: {:?}", base_path);

    let serve_dir = warp::path("files").and(warp::fs::dir(base_path.clone()));
    let list_dir = warp::path("list").and_then(move || {
        let base_path = base_path.clone();
        async move {
            let entries = std::fs::read_dir(base_path).map_err(|_| warp::reject::not_found())?;
            let mut body = String::from("<html><body><ul>");
            for entry in entries {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    let display = path.display();
                    body.push_str(&format!("<li><a href=\"/files/{}\">{}</a></li>", display, display));
                }
            }
            body.push_str("</ul></body></html>");
            Ok::<_, warp::Rejection>(Response::builder().body(body))
        }
    });

    let routes = serve_dir.or(list_dir);

    warp::serve(routes)
        .run(([127, 0, 0, 1], port))
        .await;
}

