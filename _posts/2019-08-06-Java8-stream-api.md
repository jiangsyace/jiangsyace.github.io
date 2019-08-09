---
title: Java8-Stream API
date: 2019-8-6
categories:
- tech
tags:
- java
---

Streams 的背景，以及 Java 8 中的使用详解

<!-- more -->

## 什么是Stream（流）

Stream是数据渠道，用于操作数据源（集合，数组等）所生成得元素序列。而集合讲得是数据，流讲得是计算。

1. 流只能遍历一次，就像迭代器一样
2. Stream 自己不会存储元素。

3. Stream 不会改变源对象。相反，它会返回一个持有结果得新Stream

4. Stream 操作时延迟执行得，这意味着它们会等到需要结果时才执行。（延迟加载）



Stream 不是集合元素，它不是数据结构并不保存数据，它是有关算法和计算的，它更像一个高级版本的 Iterator。原始版本的 Iterator，用户只能显式地一个一个遍历元素并对其执行某些操作；高级版本的 Stream，用户只要给出需要对其包含的元素执行什么操作，比如 “过滤掉长度大于 10 的字符串”、“获取每个字符串的首字母”等，Stream 会隐式地在内部进行遍历，做出相应的数据转换。

Stream 就如同一个迭代器（Iterator），单向，不可往复，数据只能遍历一次，遍历过一次后即用尽了，就好比流水从面前流过，一去不复返。

而和迭代器又不同的是，Stream 可以并行化操作，迭代器只能命令式地、串行化操作。顾名思义，当使用串行方式去遍历时，每个 item 读完后再读下一个 item。而使用并行去遍历时，数据会被分成多个段，其中每一个都在不同的线程中处理，然后将结果一起输出。Stream 的并行操作依赖于 Java7 中引入的 Fork/Join 框架（JSR166y）来拆分任务和加速处理过程。Java 

## 为什么需要 Stream

Stream 作为 Java 8 的一大亮点，它与 java.io 包里的 InputStream 和 OutputStream 是完全不同的概念。它也不同于 StAX 对 XML 解析的 Stream，也不是 Amazon Kinesis 对大数据实时处理的 Stream。Java 8 中的 Stream 是对集合（Collection）对象功能的增强，它专注于对集合对象进行各种非常便利、高效的聚合操作（aggregate operation），或者大批量数据操作 (bulk data operation)。Stream API 借助于同样新出现的 Lambda 表达式，极大的提高编程效率和程序可读性。同时它提供串行和并行两种模式进行汇聚操作，并发模式能够充分利用多核处理器的优势，使用 fork/join 并行方式来拆分任务和加速处理过程。通常编写并行代码很难而且容易出错, 但使用 Stream API 无需编写一行多线程的代码，就可以很方便地写出高性能的并发程序。所以说，Java 8 中首次出现的 java.util.stream 是一个函数式语言+多核时代综合影响的产物。

### 什么是聚合操作

## 流的构成

当我们使用一个流的时候，通常包括三个基本步骤：

获取一个数据源（source）→ 数据转换→执行操作获取想要的结果，每次转换原有 Stream 对象不改变，返回一个新的 Stream 对象（可以有多次转换），这就允许对其操作可以像链条一样排列，变成一个管道，如下图所示。

## 构建流
 
### 由值创建流 

// 1. Individual values
Stream stream = Stream.of("a", "b", "c");
// 2. Arrays
String [] strArray = new String[] {"a", "b", "c"};
stream = Stream.of(strArray);
stream = Arrays.stream(strArray);
// 3. Collections
List<String> list = Arrays.asList(strArray);
stream = list.stream();

### 由数组创建流

### 由文件生成流

### 由函数生成流：创建无限流

### 数值流
 
#### 原始类型流特化 

#### 数值范围 

#### 数值流应用：勾股数 



## 流操作

### 中间操作

### 终端操作 


## 使用流

### 筛选和切片

#### 用谓词筛选

#### 筛选各异的元素

#### 截短流

#### 跳过元素


### 映射

#### 对流中每一个元素应用函数 


#### 流的扁平化 

### 查找和匹配

#### 检查谓词是否至少匹配一个元素


#### 检查谓词是否匹配所有元素 

#### 查找元素 

#### 查找第一个元素 

### 归约
 
#### 元素求和 

#### 最大值和最小值 







## 相关主题

https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html

https://www.ibm.com/developerworks/cn/java/j-lo-java8streamapi/