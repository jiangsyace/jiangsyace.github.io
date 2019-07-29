---
title: Java 版本更新内容
date: 2019-7-2
categories:
- tech
tags:
- java
---

目前用的是Java8 但是也要了解一下新的Java有啥特性。以后可能用得到。

<!-- more -->

### **java 6(JDK6 2006-12-11)**

+ 命名方式变更
+ 脚本语言 
+ 编译API和微型HTTP服务器API 
+ 锁与同步 
+ 垃圾收集 
+ 类加载 
+ JDBC 4.0（jdbc高级）
+ Java Compiler （Java™ 编程语言编译器的接口）
+ 可插拔注解 
+ Native PKI(公钥基础设) 
+ Java GSS （通用安全服务）
+ Kerberos （ 一种安全认证的系统）
+ LDAP （LDAP ）
+ Web Services  （web服务）

 
### **Java 7(JDK7 2011-7-28)**

+ switch中添加对String类型的支持
+ 创建泛型对象时应用类型推断 
+ try-with-resources（一个语句块中捕获多种异常） 
+ null值的自动处理 
+ 数值类型可以用二进制字符串表示 
+ 引入Java NIO.2开发包
+ 动态语言支持 
+ 安全的加减乘除 
+ Map集合支持并发请求 

### **Java 8(JDK8 2014-3-18)**

+ Lambda表达式
+ 改进的类型推断
+ Java类型的注释
+ 重复注释
+ 方法参数反射
+ TLS 1.1和TLS 1.2默认启用
+ 有限的doPrivileged
+ 基于密码加密的更强算法
+ JSSE服务器中的SSL / TLS服务器名称指示（SNI）扩展支持
+ 支持AEAD算法
+ KeyStore增强功能
+ SHA-224消息摘要
+ 对NSA Suite B加密的增强支持
+ 对于高熵随机数生成更好的支持
+ 新PKIXRevocationChecker类
+ 适用于Windows的64位PKCS11
+ Kerberos中的新rcache类型5重放缓存
+ 协议转换和约束委派的Kerberos 5
+ 默认情况下禁用弱加密
+ GSS-API / Kerberos 5机制的未绑定SASL
+ 用于多个主机名的SASL服务
+ JNI桥接到Mac OS X上的本机JGSS
+ 在SunJSSE提供程序中支持更强大的临时DH密钥
+ 支持JSSE中的密码套件首选项自定义
+ 全新的JavaFX（详情请点击这里）
+ java工具的操作增强
+ Unicode增强功能，包括对Unicode 6.2.0的支持
+ 采用Unicode CLDR数据和java.locale.providers系统属性
+ 新日历和区域设置API
+ 引入新的Date Time API
+ Nashorn JavaScript引擎
+ 并行阵列排序
+ 标准编码和解码Base64
+ 无符号算术支持
+ 新的并发
+ Java XML技术增强功能
+ 虚拟机操作增强


### **Java 9(JDK9 2017-9-22)**

+ Java平台模块化
+ 工具的改变
  + jShell
  + 添加更多诊断命令
  + 多版本JAR文件
  + 删除JVM TI hprof代理
  + 删除jhat工具
  + 验证JVM命令行标志参数
  + 编译旧版本平台版本
  + jlink
+ 安全性的改变
  + 数据传输层安全性(DTLS)
  + TLS应用层协议协商扩展
  + 用于TLS的OCSP装订
  + 利用GHASH和RSA的CPU指令
  + 基于DRBG的SecureRandom实现
  + 禁用SHA-1证书
  + 默认创建PKCS12密匙库
  + SHA-3哈希算法
+ 部署的改变
  + 弃用java插件
  + 增强的java控制面板
  + 模块化java应用程序打包
  + 弃用Applet API
+ java语言的改变
  + 铣削Coin项目
+ javadoc的改变
  + 简化doclet API
  + HTML5 javadoc
  + javadoc 搜索
  + 模块系统
+ JVM的改变
  + 编译器控制
  + 分段代码缓存
  + 语言定义对象模型的动态链接
+ JVM调优的改变
  + 提高G1可用性，确定性和性能
  + 统一JVM日志记录
  + 删除在jdk8中不推荐的GC组合
  + 使G1成为默认的收集器
  + 统一GC记录
  + 弃用并发标记扫描(CMS)垃圾收集器
  + 删除在jdk8中不推荐的GC组合
+ 核心库的改变
  + process API更新
  + 可变手柄
  + 缩小字符串
  + 平台日志记录API和服务
  + 更多并发更新
  + XML目录
  + 更便利的集合工厂方法
  + 增强的方法句柄
  + Deprecation的弃用
  + 旋转等待提示
  + 过滤传入的序列化数据
  + 堆栈 API
  + 将选定的Xerces2.11.0更新合并到JAXP中
+ Nashorn的改变
  + Nashorn的Parser API
  + 在Nashorn中实现选定的ECMAScript 6功能
+ 客户端技术的改变
  + 多分辨率图像
  + 为模块化准备的javaFX UI控件和CSS API
  + BeanInfo注释
  + TIFF图像I / O
  + WIndows和Linux上的HiDPI Graphics
  + 特定于平台的桌面功能
  + 在Linux上启用GTK3
+ 国际化的改变
  + UUnicode 8.0
  + 默认启用CLDR区域设置数据
  + UFT-8属性文件

### **Java 10(JDK10 2018-3-20)**
  + 局部变量的类型推断 var关键字
  + GC改进和内存管理 并行全垃圾回收器 G1
  + 垃圾回收器接口
  + 线程-局部变量管控
  + 合并 JDK 多个代码仓库到一个单独的储存库中
  + 新增API：ByteArrayOutputStream
  + 新增API：List、Map、Set
  + 新增API：java.util.Properties
  + 新增API： Collectors收集器

**Java 11(JDK11 2018-9-26)**

### 参考
[https://www.cnblogs.com/vhua/p/5299709.html](https://www.cnblogs.com/vhua/p/5299709.html)  
[https://www.cnblogs.com/slwenyi/p/6393366.html](https://www.cnblogs.com/slwenyi/p/6393366.html)  
[https://blog.csdn.net/weixin_39032575/article/details/80724984](https://blog.csdn.net/weixin_39032575/article/details/80724984)