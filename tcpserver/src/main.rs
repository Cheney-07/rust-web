use std::io::{Read, Write};
use std::net::TcpListener;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:3000").unwrap();
    println!("Running on 127.0.0.1:3000");
    for stream in listener.incoming() {//返回一个迭代器，迭代器监听上面的连接，每个连接代表一个字节流
        //字节流类型为TcpStream，然后数据就可以在这个对象上进行传送和接收
        let mut stream = stream.unwrap();//result类型，简单处理一下可能的报错
        println!("Connection established!");
        let mut buffer=[0;1024];
        stream.read(&mut buffer).unwrap();//通过read的方法把stream里的数据放到buffer里面
        stream.write(&mut buffer).unwrap();//通过write的方法，再将数据返回回去
    }
}
