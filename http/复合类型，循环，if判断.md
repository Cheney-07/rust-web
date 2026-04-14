cargo.lock 在第一次执行cargo build 命令生成（cargo根据写的依赖，将其写到cargo.lock文件里）
fn main() // 主函数
use std::io;//导入库的写法
use rand::Rng;//导入随机数库
println!("{}",guess)//输出  {}(占位符) 

io::stdin.read_line(&mut 变量) 使用io库下stdin函数的read_line方法,(&mut 可变引用)

let 定义变量
let mut 定义可变变量

let mut guess=String::new(); //定义一个可变变量 并给其赋值一个空字符串

---

let guess:u32 =guess.trim().parse().expect("Please type a number!");  
//同名但是不同的变量（遮蔽），将gusess变量调用trim方法将空白去掉，然后使用parse解析为等号左边的类型  
// 最后写except来处理错误情况

---
match guess.cmp(&number){  
    Ordering::Less=>println!("Too small!"),  
    Ordering::Greater=>println!("Too big!"),  
    Ordering::Equal=> {  
        println!("You win!");  
        break;  
        },  
    }//相当于switch  
    方法返回值为枚举，就可以使用match

let guess:u32 =match guess.trim().parse() {  
        Ok(num)=>num,  
        Err(_)=>continue,  
    }
    
`Result` 只有两个合法的变体（variant）：
`Ok(值) Err(错误)`

match 表达式 {
    模式1 => 表达式1,
    模式2 => 表达式2,
    模式3 => 表达式3,
}

---
rust 复合类型
Tuple（元组）
包含不同类型元素的集合（固定长度）
let my_tuple=('A',1,1.2);
let tup:(i32,f64,u8)=(500,16.4,1);//显式标明类型
let five_hundred=tup.0; //访问元组方式

let(x,y,z)=tup; //模式匹配
println!("x:{},y:{},z:{}",x,y,z);//解构

Array（数组）
（固定长度，元素类型相同）
let my_arr=[1,2,3];
let my_arr_typed:[i32;3]=[1,2,3];//显式标明类型
let a=[3;5];//let a=[3,3,3,3,3];
let first =my_arr[0];//访问数组方式

---
定义函数

fn another-function(x:i32){
	println!("the value is{}",x);
}//必须声明每个参数的类型 参数名:类型
//多个参数使用","分开

语句：执行某些操作的指令，不返回值
表达式：计算并返回一个结果值（函数的调用，宏的调用）

函数体由一系列语句组成，可由表达式结尾
{
	let x=3;
	 x+1
}//用花括号定义的一个新作用域，也是一个表达式
{
	let x=3;
	 x+1；
}//但是如果加了分号，就成为了语句，无法返回值
fn five() -> i32{
	5//函数如果有返回值，必须首先声明函数的返回类型
}//返回值可以用return，也可以是函数体最后一个表达式的值

函数默认返回()，除非显式返回其他类型。可省略去写默认返回。

---
控制流
if表达式
if x<5{

} else {

}//if和else里的返回类型必须一致

loop循环
loop{
	 //括号里的代码会一直执行
	 //break:停止loop
	 //continue:跳出本次迭代
	 break counter 2；// 可以作为loop的返回值，因为break和return是控制流表达式，故加上分号仍然可以返回值。
}
'随便起名: loop{

	loop{
		if x=12{
			break '随便起名;//可以直接跳出到’随便起名的loop循环外面
			}
	}
}

while循环
while number!=0//条件为真一直循环{

}

for循环（循环遍历集合的元素）
for element in a{
	println!("{element}");
}
for element in (1..4).rev(){ //(1..4)规定一个范围，不包括4；rev()倒序输出的方法
	println!("{element}");
}
