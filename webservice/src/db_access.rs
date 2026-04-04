use super::models::*;
use chrono::NaiveDateTime;
use sqlx::postgres::PgPool;

pub async fn get_courses_for_teacher_db(pool:&PgPool, teacher_id:i32)->Vec<Course> {
    let rows = sqlx::query!(
        r#"SELECT id,teacjer_id,name,time
        FROM course
        WHERE teacher_id = $1"#, //$1为占位符
        teacher_id
    )
        .fetch_all(pool)//fetch_all可以查询多条记录，参数为数据库连接池,不管查询结果是多条数据还是单条数据，使用fetchall得到的始终是一个由元组组成的列表。
        .await//一般来说，查询结果集是单条数据的，使用fetchone获取数据,一般来说，查询结果集是多条数据的，使用fetchall获取数据
        .unwrap();//fetchall(),如果需要取元组中的数值，需要使用rows.fetchone[0][0]
    rows.iter()
        .map(|r| Course {
            id: Some(r.id),
            teacher_id: r.teacher_id,
            name: r.name.clone(),
            time: Some(NaiveDateTime::from(r.time.unwrap())),
        })
        .collect()
}

pub async fn get_course_details_db(pool:&PgPool, teacher_id:i32,course_id:i32)->Course {
    let row = sqlx::query!(
        r#"SELECT id,teacher_id,name,time
        FROM course
        WHERE teacher_id = $1 and id = $2"#,//sql语句字符串涉及到多行，需要使用r#，$1,$2占位符
        teacher_id,
        course_id
    )
        .fetch_one(pool)//不管查询结果是多条数据还是单条数据，使用fetchone得到的始终是一个元组,如果需要取元组中的数值，需要使用row.fetchone[0]
        .await
        .unwrap();

    Course{
        id: Some(row.id),
        teacher_id: row.teacher_id,
        name: row.name.clone(),
        time:Some(NaiveDateTime::from(row.time.unwrap())),
    }
}

pub async fn post_new_course_db(pool:&PgPool, new_course:Course)->Course{
    let row = sqlx::query!(
        r#"INSERT INTO course(id, teacher_id, name)
        VALUES ($1, $2, $3)
        RETURNING id,teacher_id,name,time"#,
        new_course.id,
        new_course.teacher_id,
        new_course.name,
    )
        .fetch_one(pool)
        .await
        .unwrap();
        Course{
            id: Some(row.id),
            teacher_id: row.teacher_id,
            name: row.name.clone(),
            time:Some(NaiveDateTime::from(row.time.unwrap())),
        }
}