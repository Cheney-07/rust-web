use std::io::{Read, Write};
use std::net::TcpStream;
use std::str;

fn main() {
    let mut stream=TcpStream::connect("127.0.0.1:3000").unwrap();
    stream.write("Hello, world!".as_bytes()).unwrap();//因为传输需要原始字节，使用as_bytes()方法返回原始字节
    //向服务器发送数据
    let mut buffer=[0;20];
    stream.read(&mut buffer).unwrap();
    println!("Response from server:{:?}"
        ,str::from_utf8(&buffer).unwrap()
    )   //将字节流转换为字符
    //接收服务器数据
}
