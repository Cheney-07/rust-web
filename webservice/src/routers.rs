use super::handlers::*;
use actix_web::web;

pub fn general_routes(cfg: &mut web::ServiceConfig) {
    cfg.route("/health", web::get().to(health_check_handler));
}

/**
 * 课程相关路由配置
 * 
 * 在使用postman测试此接口的时候，需要设置请求头：content-type=application/json
 * 请求body中数据类型严格按照models中的定义来，例如 teacher_id 若传字符串 1 ，则会报400（bad request）的错误
 * 
 * 
 */
pub fn course_routes(cfg: &mut web::ServiceConfig) {
    //路由配置方式一
    cfg.service(web::scope("/course")
    .route("/", web::post().to(new_course))
    .route("/{teacher_id}",web::get().to(get_teacher_course))
    .route("/{teacher_id}/{course_id}",web::get().to(get_course))
    );

    //路由配置方式二
    // cfg.route("/course",web::post().to(new_course));
}
