use actix_web::web;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
//use crate::models::course::Course;
use crate::errors::MyError;
use std::convert::TryFrom;
#[derive(Debug, Clone, Serialize,sqlx::FromRow)]
pub struct Course {
    pub teacher_id: i32,
    pub id: i32,
    pub name: String,
    pub time: Option<NaiveDateTime>,

    pub description: Option<String>,
    pub format: Option<String>,
    pub structure: Option<String>,
    pub duration: Option<String>,
    pub price: Option<i32>,
    pub language: Option<String>,
    pub level: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct CreateCourse{
    pub teacher_id: i32,
    pub name: String,
    pub description: Option<String>,
    pub format: Option<String>,
    pub structure: Option<String>,
    pub duration: Option<String>,
    pub price: Option<i32>,
    pub language: Option<String>,
    pub level: Option<String>,
}

/*impl From<web::Json<CreateCourse>> for CreateCourse {
    fn from(course: web::Json<Course>) -> Self {
        Course {
            description: course.description,
            teacher_id: course.teacher_id,
            id: course.id,
            name: course.name.clone(),
            time: course.time,
        }
    }
}*/

impl TryFrom<web::Json<CreateCourse>> for CreateCourse {
    type Error = MyError;
    fn try_from(course: web::Json<CreateCourse>)
        -> Result<Self, Self::Error> {
        Ok(CreateCourse{
            teacher_id: course.teacher_id,
            name:course.name.clone(),
            description: course.description.clone(),
            format:course.format.clone(),
            structure:course.structure.clone(),
            duration:course.duration.clone(),
            price:course.price,
            language:course.language,
            level:course.level.clone(),
        })
    }
}

#[derive(Debug, Clone, Deserialize)]
pub struct UpdateCourse{
    pub name: Option<String>,
    pub description: Option<String>,
    pub format: Option<String>,
    pub structure: Option<String>,
    pub duration: Option<String>,
    pub price: Option<i32>,
    pub language: Option<String>,
    pub level: Option<String>,
}

impl From<web::Json<UpdateCourse>> for UpdateCourse {
    fn from(course: web::Json<CreateCourse>) -> Self{
       UpdateCourse{
            name: course.name.clone(),
            description: course.description.clone(),
            format:course.format.clone(),
            structure:course.structure.clone(),
            duration:course.duration.clone(),
            price:course.price,
            language:course.language,
            level:course.level.clone(),
        }
    }
}
