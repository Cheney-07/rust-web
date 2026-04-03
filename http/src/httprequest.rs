use std::collections::HashMap;
#[derive(Debug,PartialEq)]
pub enum Method {
    Get,
    Post,
    Uninitialized,
}
impl From<&str> for Method {
    fn from(s: &str) -> Method {
        match s{
            "GET" => Method::Get,
            "POST" => Method::Post,
            _ => Method::Uninitialized,
        }
    }
}
#[derive(Debug,PartialEq)]
pub enum Version {
    V1_1,
    V2_0,
    Uninitialized,
}
impl From<&str> for Version {
    fn from(s: &str) -> Version {
        match s{
            "HTTP/1.1" => Version::V1_1,
            _ => Version::Uninitialized,
        }
    }
}

#[derive(Debug,PartialEq)]
pub enum Resource {
    Path(String),
}
#[derive(Debug)]
pub struct HttpRequest {
    pub method: Method,
    pub version: Version,
    pub resource: Resource,
    pub headers: HashMap<String, String>,
    pub msg_body: String,
}

impl From<String> for HttpRequest {
    fn from(s: String) -> Self{
        let mut parsed_method = Method::Uninitialized;
        let mut parsed_version = Version::V1_1;
        let mut parsed_resource = Resource::Path("".to_string());
        let mut parsed_headers = HashMap::new();
        let mut parsed_msg_body = "";

        for line in s.lines(){
            if line.contains("HTTP") {
                let (method,resource,version)=process_req_line(line);
                parsed_method = method;
                parsed_version = version;
                parsed_resource = resource;
            }else if line.contains(":"){
                let (key,value)=process_header_line(line);
                parsed_headers.insert(key,value);
            }else if line.len()==0{

            }else{
                parsed_msg_body = line;
            }
        }
        HttpRequest{
            method:parsed_method,
            version:parsed_version,
            resource:parsed_resource,
            headers:parsed_headers,
            msg_body:parsed_msg_body.to_string()
        }
    }
}

fn process_req_line(s: &str) -> (Method,Resource,Version){//传进去字符串切片
    let mut words =s.split_whitespace();//按空白将其分为多个单词
    let method=words.next().unwrap();//用next方法，将words挨个遍历，用unwrap将值取出，并简单处理可能的错误
    let resource=words.next().unwrap();
    let version =words.next().unwrap();
    (
        method.into(),
        Resource::Path(resource.to_string()),
        version.into()
    )
}

fn process_header_line(s: &str) -> (String, String){
    let mut header_items = s.split(":");//按冒号分成多个单词
    let mut key =String::from("");
    let mut value =String::from("");
    if let Some(k) = header_items.next(){
        key=k.to_string();//使用let some将key从里面一个个取出，返回的是option，转换为string
    }
    if let Some(v) = header_items.next(){
        value=v.to_string();//使用let some将vaule从里面一个个取出，返回的是option，转换为string
    }
    (key, value)
}