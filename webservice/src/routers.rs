use crate::handlers::{course::*,general::*};
use actix_web::web;

pub fn general_routes(cfg: &mut web::ServiceConfig) {
    cfg.route("/health", web::get().to(health_check_handler));
}

/**
 * 在使用postman测试此接口的时候，需要设置请求头：content-type=application/json
 * 请求body中数据类型严格按照models中的定义来，例如 teacher_id 若传字符串 1 ，则会报400（bad request）的错误
 * 
 * 
 */
pub fn course_routes(cfg: &mut web::ServiceConfig) {
    //路由配置方式一
    cfg.service(
        web::scope("/course")
            .route("/", web::post().to(post_new_course))
            .route("/{teacher_id}",web::get().to(get_course_for_teacher))
            .route("/{teacher_id}/{course_id}",web::get().to(get_course_detail))
            .route("/{teacher_id}/{course_id}",
                   web::delete().to(delete_course))
            .route("/{teacher_id}/{course_id}",
                   web::put().to(update_course_details))
    );

    //路由配置方式二
    // cfg.route("/course",web::post().to(new_course));
}
