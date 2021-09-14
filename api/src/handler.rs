use std::convert::Infallible;

use crate::cmd;
use serde::Serialize;
use serde_json::json;
use axum::{
    Json, 
    body::{Full, Bytes}, 
    response::IntoResponse,
    http::{Response, StatusCode},
};

#[derive(Debug, Serialize)]
pub struct ContainerResponse {
    pub status: i32,
    pub ok: bool,
}

impl ContainerResponse {
    fn new(ok: bool, status: i32) -> Self {
        ContainerResponse { status, ok }
    }
}

#[derive(Debug)]
pub enum ContainerError {
    Unsuccessful(i32),
}

impl IntoResponse for ContainerError {
    type Body = Full<Bytes>;
    type BodyError = Infallible;

    fn into_response(self) -> Response<Self::Body> {
        let (status, error_message) = match self {
            ContainerError::Unsuccessful(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Container process fail to stop"),
        };
        let body = Json(json!({
            "error": error_message,
        }));
        (status, body).into_response()
    }
}

pub async fn ping() -> String {
    "pong".to_string()
}

pub async fn stop_containers() -> Result<Json<ContainerResponse>, ContainerError> {
    match cmd::stop_containers().await {
        Ok(()) => Ok(Json(ContainerResponse::new(true, 0))),
        _ => Err(ContainerError::Unsuccessful(1)),
    }

}

pub async fn start_containers() -> Result<Json<ContainerResponse>, ContainerError> {
    match cmd::start_containers().await {
        Ok(stat) if stat.code().is_some() => Ok(
            Json(ContainerResponse::new(stat.success(), stat.code().unwrap()))
        ),
        _ => Err(ContainerError::Unsuccessful(1)),
    }
}

