use crate::errors::MyError;
use crate::state::AppState;
use crate::dbaccess::course::*;
use actix_web::{web, HttpResponse };
use crate::models::course::{CreateCourse, UpdateCourse};

/**
 * 新增课程 处理器
 */
pub async fn post_new_course(
    new_course: web::Json<CreateCourse>,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse, MyError> {//同样修改返回类型
    post_new_course_db(&app_state.db,new_course.try_into()?)
        .await
        .map(|course|HttpResponse::Ok().json(course))//闭包，返回
}

/**
 * 获取老师得课程
 */
pub async fn get_course_for_teacher(
    params: web::Path<i32>,//xxxx/{teacher_id}
    app_state: web::Data<AppState>,
) -> Result<HttpResponse,MyError> {
    let teacher_id = params.into_inner();
    get_courses_for_teacher_db(&app_state.db, teacher_id)
        .await
        .map(|courses| HttpResponse::Ok().json(courses))
}

/**
 * 获取老师指定课程
 */
pub async fn get_course_detail(
    params: web::Path<(i32, i32)>,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse,MyError> {
    let (teacher_id,course_id) = params.into_inner();
    get_course_details_db(&app_state.db, teacher_id, course_id)
        .await
        .map(|course| HttpResponse::Ok().json(course))
}

pub async fn delete_course(
    app_state: web::Data<AppState>,
    params: web::Path<(i32, i32)>,
) -> Result<HttpResponse,MyError> {
    let (teacher_id,course_id) = params.into_inner();
    delete_course_db(&app_state.db, teacher_id, course_id)
    .await
        .map(|resp| HttpResponse::Ok().json(resp))
}

pub async fn update_course_details(
    app_state: web::Data<AppState>,
    update_course: web::Json<UpdateCourse>,
    params: web::Path<(i32, i32)>,
) -> Result<HttpResponse,MyError> {
    let (teacher_id,course_id) = params.into_inner();
    update_course_details_db(&app_state.db,teacher_id,course_id,update_course.into())
        .await
        .map(|resp| HttpResponse::Ok().json(resp))
}