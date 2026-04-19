use crate::models::course::*;
use crate::errors::MyError;
use chrono::NaiveDateTime;
use sqlx::postgres::PgPool;


pub async fn get_courses_for_teacher_db(pool:&PgPool, teacher_id:i32)
    ->Result<Vec<Course>,MyError> {
    let rows:Vec<Course>= sqlx::query_as!(
        Course,
        r#"SELECT * FROM course WHERE teacher_id = $1"#, //$1为占位符
        teacher_id
    )
        .fetch_all(pool)//fetch_all可以查询多条记录，参数为数据库连接池,不管查询结果是多条数据还是单条数据，使用fetch_all得到的始终是一个由元组组成的列表。
        .await?;//一般来说，查询结果集是单条数据的，使用fetch_one获取数据,一般来说，查询结果集是多条数据的，使用fetch_all获取数据
    //fetch_all(),如果需要取元组中的数值，需要使用rows.fetch_one[0][0]

    Ok(rows)
}

pub async fn get_course_details_db(pool:&PgPool, teacher_id:i32,course_id:i32)
    ->Result<Course,MyError> {
    let row = sqlx::query_as!(
        Course,
        r#"SELECT * FROM course WHERE teacher_id = $1 and id = $2"#,//sql语句字符串涉及到多行，需要使用r#，$1,$2占位符
        teacher_id,
        course_id
    )
        .fetch_optional(pool)//不管查询结果是多条数据还是单条数据，使用fetch_one得到的始终是一个元组,如果需要取元组中的数值，需要使用row.fetch_one[0]
        .await?;//将错误传递给调用此函数的handler中

    if let Some(course) = row {
        Ok(course)
    }else {
        Err(MyError::NotFound("Course Id not found".into()))
    }

}

pub async fn post_new_course_db(pool:&PgPool, new_course:CreateCourse)->Result<Course,MyError> {
    let row = sqlx::query_as!(
        Course,
        r#"INSERT INTO course(teacher_id, name,description,format,structure,duration,price,language,level)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id,teacher_id,time,name,description,format,structure,duration,price,language,level"#,
        new_course.teacher_id,new_course.name,new_course.description,
        new_course.format, new_course.structure,new_course.duration,
        new_course.price,new_course.language, new_course.level,
    )
        .fetch_one(pool)
        .await?;//？可以代替match，如果正确，返回下面定义的Ok，不正确则返回一个错误

    Ok(row)
}

pub async fn delete_course_db(
    pool: &PgPool,
    teacher_id: i32,
    id: i32
) -> Result<(), MyError> {

    let result = sqlx::query!(
        "DELETE FROM course WHERE teacher_id = $1 AND id = $2",
        teacher_id,
        id,
    )
        .execute(pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(MyError::NotFound("Course not found".into()));
    }

    Ok(())
}

pub async fn update_course_details_db(
    pool:&PgPool,
    teacher_id:i32,
    id: i32,
    update_course:UpdateCourse,
)->Result<Course,MyError> {
    let current_course_row = sqlx::query_as!(
        Course,
        "SELECT * FROM course WHERE teacher_id = $1 and id = $2",
        teacher_id,
        id
    )
        .fetch_one(pool)
        .await
        .map_err(|_err| MyError::NotFound("Course Id not found".into()))?;

    let name: String = if let Some(name) = update_course.name {
        name
    } else {
        current_course_row.name
    };
    let description: String = if let Some(description) = update_course.description {
        description
    } else {
        current_course_row.description.unwrap_or_default()
    };
    let format: String = if let Some(format) = update_course.format {
        format
    } else{
        current_course_row.format.unwrap_or_default()
    };
    let structure: String = if let Some(structure) = update_course.structure {
        structure
    } else{
        current_course_row.structure.unwrap_or_default()
    };
    let duration: String = if let Some(duration) = update_course.duration {
        duration
    } else {
        current_course_row.duration.unwrap_or_default()
    };
    let price: i32 = if let Some(price) = update_course.price {
        price
    } else {
        current_course_row.price.unwrap_or_default()
    };
    let language: String = if let Some(language) = update_course.language {
        language
    } else {
        current_course_row.language.unwrap_or_default()
    };
    let level: String = if let Some(level) = update_course.level {
        level
    } else {
        current_course_row.level.unwrap_or_default()
    };
    let course_row = sqlx::query_as!(
        Course,
        "UPDATE course SET name = $1, description = $2, format = $3,
        structure = $4, duration = $5, price = $6, language = $7,
        level = $8 where teacher_id = $9 and id = $10
        RETURNING id,teacher_id,name,time,language,
        description,format,structure,duration,price,level",
        name,description,format,structure,duration,
        price,language,level,teacher_id,id
    )
        .fetch_one(pool)
    .await;

    if let Ok(course) = course_row {
        Ok(course)
    } else {
        Err(MyError::NotFound("Course Id not found".into()))
    }
}