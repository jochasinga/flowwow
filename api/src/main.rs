mod handler;
mod cmd;
use handler::{
    ping,
    stop_containers,
    start_containers
};

use axum::{handler::get, Router};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/ping", get(ping))
        .route("/emulator/stop", get(stop_containers))
        .route("/emulator/start", get(start_containers));

    let addr = SocketAddr::from(([127, 0, 0, 1], 8000));
    tracing::debug!("API server listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}


