use warp::{http::StatusCode, reject::Rejection, reply::with_status, Reply};

pub async fn handle_rejection(err: Rejection) -> Result<impl Reply, Rejection> {
    if err.is_not_found() {
        Ok(with_status("Not Found", StatusCode::NOT_FOUND))
    } else {
        eprintln!("Unhandled error: {:?}", err);
        Ok(with_status("Internal Server Error", StatusCode::INTERNAL_SERVER_ERROR))
    }
}
