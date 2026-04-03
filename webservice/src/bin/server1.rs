use actix_web::{web, App, HttpMessage, HttpRequest, HttpResponse, HttpServer, Responder};
use std::io;

//配置 route
pub fn general_routes(cfg: &mut web::ServiceConfig) {
    cfg.route("/health", web::get().to(health_check_handler));
}

//配置 handler
pub async fn health_check_handler() -> impl Responder {
    HttpResponse::Ok().json("actix is runing , health check is  ok!!!")
}

//实例化 httpServer
#[actix_rt::main]
async fn main() -> io::Result<()> {
    let app = move || App::new().configure(general_routes);
    HttpServer::new(app).bind("127.0.0.1:3000")?.run().await
}
