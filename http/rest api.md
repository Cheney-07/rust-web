![[Pasted image 20260310200231.png]]

---
route
pub fn general_routes(cfg: &mut web::ServiceConfig) {  
    cfg.route("/health", web::get().to(health_check_handler));  
}
cfg: &mut web::ServiceConfig传进来这个参数类型
.route("/", web::post().to(new_course)),如果是/，并且web::post（是post方法），就.to()到new_course函数（route对应的handler）

.service(web::scope("/courses")  定义了一个作用域，相当于定义了根路径

---
handler
```rust
pub async fn health_check_handler(app_state: web::Data<AppState>) -> HttpResponse {  
    println!("coming  in    health_check_handler");  
    let health_check_response = &app_state.health_check_response;  
    let mut visit_count = app_state.visit_count.lock().unwrap();  
    let response = format!("{} {} times   ", health_check_response, visit_count);  
    *visit_count += 1;  
    HttpResponse::Ok().json(&response)  
}
```
// HttpResponse::Ok()返回ok的response，.json返回json格式的response
.into_iter()//将数据变成遍历器
.filter()//然后就可以进行过滤数据的操作

```rust
(app_state: web::Data<AppState>)//<AppState>数据类型，使用web::Data提取，让其可以被访问
```
Actix-web 的函数参数不是随心所欲写的。每一个参数都必须实现一个特定的 **Trait（特征）**，叫做 `FromRequest`。

- **`web::Data<T>`**：实现了这个特征。它的意思是：“框架知道怎么去全局仓库里找到类型为 `T` 的数据并把它拿出来递给函数。”
- web::Path web::Path<(usize, usize)>, // 这里的 (usize, usize) 对应路径里的两个变量,作用就是：**把 URL 路径中那些“变动的部分”，精准地抓取出来并转换成 Rust 的变量。**
---
main
#[actix_rt::main]进行异步的注释
let app = move || App::new().configure(general_routes);//定义要生成的应用，配置路由，使用.configure(general_routes);传进来函数

用HttpServer::new(app).bind("127.0.0.1:3000")?.run().await //bind(在3000端口进行监听)，
初始化httpserver，new一个app，然后run准备，await执行异步

let app = move || {  //**闭包（Closures）** 是一种可以保存在变量中或作为参数传递的“匿名函数”
    App::new()  
        .app_data(data.clone())  
        .configure(general_routes)  
        .configure(course_routes)  
};

闭包
### 闭包的语法：`||` 是什么？

普通的函数长这样：

```
fn add(a: i32, b: i32) -> i32 { a + b }
```

对应的闭包长这样：

```
let add = |a, b| a + b;
```

- **`||`**：就像是函数的“参数大门”。如果大门里是空的，说明这个函数不需要输入参数。
    
- **匿名性**：它没有名字，通常直接赋值给一个变量（比如 `app`），或者直接作为参数传给另一个函数（比如传给 `HttpServer::new`）。
- **闭包**：可以像“吸尘器”一样，**捕获**它被定义时周围环境中的变量。闭包捕获变量有三种方式：借用、可变借用、**夺取所有权（move）**。写上 `move`，闭包和线程就会拥有data所有，不管 `main` 函数死活，都会去线程工作。”
### `.app_data()`：存入共享数据

它的作用是把一个变量（通常是状态、数据库连接池、配置信息）交给框架管理，以便在后续的 `Handler` 中使用。Web 服务器是多线程的，你不能简单地定义一个全局变量。通过 `.app_data()` 存入的数据，Actix 会确保它能安全地在各个线程之间共享。

### `.configure()`：注入路由配置

它的作用是把路由定义的逻辑（即 URL 路径和 Handler 的映射关系）从 `main` 函数中解耦出来。

---
state
pub struct AppState {  
    pub health_check_response: String,  
    pub visit_count: Mutex<u32>,  
    pub courses: Mutex<Vec<Course>>,  
}
当application state在actix里注册后，就可以注入到handler里

---
models

#[derive(Debug, Clone, Deserialize, Serialize)]  定义需要用到的结构体course，派生宏，不用自己写的一些常见功能
#[derive(Debug, Clone, Deserialize, Serialize)]  
pub struct Course {  
    pub teacher_id: usize,  
    pub id: Option<usize>,  
    pub name: String,  
    pub time: Option<NaiveDateTime>,  
}

- **`use` 只是“引入名字”**，它解决的是“认识谁”的问题，不能凭空变出数据。
    
- 在 `states.rs` 里直接写 `Course`，是因为你只是在**“描述容器的内容”**。
    
- 在 `handlers.rs` 里必须写 `web::Data<AppState>`，是因为你是在**“向 Actix 框架索要运行时的数据”**。`web::Data` 就是你向框架出示的“取件凭证”。

impl From<web::Json<Course>> for Course {  //web::Json,数据提取器，将请求里的json格式数据，转换为course类型数据
    fn from(course: web::Json<Course>) -> Self {  
        Course {  
            teacher_id: course.teacher_id,  
            id: course.id,  
            name: course.name.clone(),  
            time: course.time,  
        }  
    }

