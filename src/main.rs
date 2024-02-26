use warp::{Filter, fs, http::Method, Reply, reject};
use std::net::SocketAddr;
use crate::file_operations::{list_directory, get_file_content, save_file_content};
use crate::errors::handle_rejection;

#[tokio::main]
async fn main() {
    let matches = App::new("ServeIt Dashboard")
        .version("1.0")
        .about("Serves files and directories along with the ServeIt Dashboard")
        .arg(Arg::new("port")
            .short('p')
            .long("port")
            .takes_value(true)
            .help("Port to run the server on"))
        .get_matches();

    let port = matches.value_of("port").unwrap_or("3030").parse::<u16>().unwrap();

    // Serve static files and index.html
    let static_files = fs::dir("./serveit-dashboard/build/static");
    let index = warp::path::end().map(|| warp::fs::file("./serveit-dashboard/build/index.html"));

    // API routes
    let api_routes = warp::path("api")
        .and(
            warp::path("list")
                .and(warp::get())
                .and(warp::path::param())
                .and_then(|path: String| async move {
                    list_directory(path.into()).await.or_else(|_| Err(reject::not_found()))
                })
            .or(warp::path("content")
                .and(warp::get())
                .and(warp::path::param())
                .and_then(|path: String| async move {
                    get_file_content(path.into()).await.or_else(|_| Err(reject::not_found()))
                }))
            .or(warp::path("content")
                .and(warp::post())
                .and(warp::path::param())
                .and(warp::body::json())
                .and_then(|path: String, content: models::FileContent| async move {
                    save_file_content(path.into(), content).await.or_else(|_| Err(reject::not_found()))
                }))
        )
        .recover(handle_rejection);

    // Combine all routes
    let routes = static_files
        .or(index)
        .or(api_routes)
        .with(warp::cors().allow_any_origin());

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!("Serving on http://{}", addr);

    warp::serve(routes).run(addr).await;
}
