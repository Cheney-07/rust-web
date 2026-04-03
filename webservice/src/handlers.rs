use super::models::Course;
use super::state::AppState;
use actix_web::{web, HttpResponse, Responder};
use chrono::Utc;

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
    println!("received  new   course");
    //计算 course 的 id，保证 id 自增
    let course_count = app_state
        .courses
        .lock()
        .unwrap()
        .clone()
        .into_iter()
        .filter(|course| course.teacher_id == new_course.teacher_id)
        .collect::<Vec<Course>>()
        .len();

    //构造一个  course
    let init_course = Course {
        teacher_id: new_course.teacher_id,
        id: Some(course_count + 1),
        name: new_course.name.clone(),
        time: Some(Utc::now().naive_utc()),
    };

    //构造的 course 写入缓存中
    app_state.courses.lock().unwrap().push(init_course);
    HttpResponse::Ok().json("success , course added !!!")
}

/**
 * 获取老师得课程
 */
pub async fn get_teacher_course(
    params: web::Path<usize>,
    app_state: web::Data<AppState>,
) -> HttpResponse {
    println!("get_teacher_course params is :{}", params);
    let teacher_id: usize = params.into_inner();
    let filter_course = app_state
        .courses
        .lock()
        .unwrap()
        .clone()
        .into_iter()
        .filter(|course| course.teacher_id == teacher_id)
        .collect::<Vec<Course>>();

    if filter_course.len() > 0 {
        HttpResponse::Ok().json(filter_course)
    } else {
        HttpResponse::Ok().json("teacher`s  course not find".to_string())
    }
}

/**
 * 获取老师指定课程
 */
pub async fn get_course(
    params: web::Path<(usize, usize)>,
    app_state: web::Data<AppState>,
) -> HttpResponse {
    println!("get_course params is :{:?}", params);
    let (teacher_id, course_id) = params.into_inner();
    let selected_course = app_state
        .courses
        .lock()
        .unwrap()
        .clone()
        .into_iter()
        .find(|x| x.teacher_id == teacher_id && x.id == Some(course_id))
        .ok_or("course  not  find");
    if let Ok(course) = selected_course {
        HttpResponse::Ok().json(course)
    } else {
        HttpResponse::Ok().json("course not find ".to_string())
    }
}

pub async fn update_course_name(
    new_course: web::Json<Course>,
    app_state: web::Data<AppState>,
) -> HttpResponse {
    let mut courses = app_state.courses.lock().unwrap();
    let target_course = courses.iter_mut().find(|x| {
        x.teacher_id == new_course.teacher_id && x.id == new_course.id
    });
    match target_course {
        Some(course) => {
            course.name = new_course.name.clone();
            HttpResponse::Ok().json(course)
        }
        None => {
            HttpResponse::NotFound().json("course not found")
        }
    }
}