use super::models::Course;
use super::state::AppState;
use actix_web::{web, HttpResponse, Responder};
use chrono::Utc;
use crate::db_access::{get_course_details_db, get_courses_for_teacher_db, post_new_course_db};

/**
 * 健康检查 处理器
 */
pub async fn health_check_handler(app_state: web::Data<AppState>) -> HttpResponse {
    println!("coming  in    health_check_handler");
    let health_check_response = &app_state.health_check_response;
    let mut visit_count = app_state.visit_count.lock().unwrap();
    let response = format!("{} {} times   ", health_check_response, visit_count);
    *visit_count += 1;
    HttpResponse::Ok().json(&response)
}

/**
 * 新增课程 处理器
 */
pub async fn new_course(
    new_course: web::Json<Course>,
    app_state: web::Data<AppState>,
) -> HttpResponse {
    let course = post_new_course_db(&app_state.db,new_course.into()).await;
    HttpResponse::Ok().json(course)
}

/**
 * 获取老师得课程
 */
pub async fn get_teacher_course(
    params: web::Path<usize,>,//xxxx/{teacher_id}
    app_state: web::Data<AppState>,
) -> HttpResponse {
    let teacher_id = i32::try_from(params.into_inner()).unwrap();
    let courses = get_courses_for_teacher_db(&app_state.db, teacher_id).await;
        HttpResponse::Ok().json(courses)
}

/**
 * 获取老师指定课程
 */
pub async fn get_course(
    params: web::Path<(usize, usize)>,
    app_state: web::Data<AppState>,
) -> HttpResponse {
        let teacher_id = i32::try_from(params.0).unwrap();
    let course_id = i32::try_from(params.1).unwrap();
    let course = get_course_details_db(&app_state.db, teacher_id, course_id).await;
        HttpResponse::Ok().json(course)
}
