use super::handlers::*;
use actix_web::web;

pub fn general_routes(cfg: &mut web::ServiceConfig) {
    cfg.route("/health", web::get().to(health_check_handler));
}


pub fn course_routes(cfg: &mut web::ServiceConfig) {
    //路由配置方式一
    cfg.service(web::scope("/course")
    .route("/", web::post().to(new_course))
    .route("/{teacher_id}",web::get().to(get_teacher_course))
    .route("/{teacher_id}/{course_id}",web::get().to(get_course))
        .route("/update",web::post().to(update_course_name))
    );

    //路由配置方式二
    // cfg.route("/course",web::post().to(new_course));
}
