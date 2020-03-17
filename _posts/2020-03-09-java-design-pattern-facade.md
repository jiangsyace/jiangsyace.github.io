---
title: Java设计模式——外观模式
date: 2020-03-09
categories:
- tech
tags:
- java
- design pattern
---

外观模式是一种结构型设计模式，也叫门面模式。当系统拥有多个子系统的时候，为了方便客户使用，结构上封装一层统一调用的外观，这种模式叫做外观模式。

<!-- more -->

外观模式是隐藏了子系统的具体实现过程，简化客户端的调用。

外观模式涉及2个角色：
+ 子系统(SubSystem)角色 ：可以同时有一个或者多个子系统。每个子系统都不是一个单独的类，而是一个类的集合。每个子系统都可以被客户端直接调用，或者被外观角色调用。子系统并不知道外观角色的存在，对于子系统而言，外观角色仅仅是另外一个客户端而已。 
+ 外观(Facade)角色 ：客户端可以调用这个角色的方法。此角色知晓相关的（一个或者多个）子系统的功能和责任。在正常情况下，本角色会将所有从客户端发来的请求委派到相应的子系统去。

类图结构如下：

![](/assets/upload/2020-03/1583708912.png)

## 外观模式的实现

子系统角色相对独立，分别实现各自的业务逻辑，这些业务可以直接被客户端调用，也可以被外观角色调用。
```
public class ClassA {

    public void doSomethingA(){
        //业务逻辑
    }
}
public class ClassB {

    public void doSomethingB(){
        //业务逻辑
    }
}

public class ClassC {

    public void doSomethingC(){
        //业务逻辑
    }
}

```

外观角色包含多个子系统，并提供对外访问的方法。
```
public class Facade {
    //被委托的对象
    private ClassA a = new ClassA();
    private ClassB b = new ClassB();
    private ClassC c = new ClassC();
    
    //提供给外部访问的方法
    public void methodA(){
        this.a.doSomethingA();
    }
    
    public void methodB(){
        this.b.doSomethingB();
    }
    
    public void methodC(){
        this.a.doSomethingA();
        this.c.doSomethingC();
    }
}
```

## 外观模式的优缺点

+ 优点：
	+ 使客户和子系统中的类无耦合，并且子系统使用起来更加方便。
	+ 外观只是提供一个更加简洁的界面，并不影响用户直接使用子系统中的类。
	+ 子系统中任何类对其方法的内容进行修改，并不影响外观类的代码。
	 
+ 缺点：
	+ 不符合开闭原则，对修改关闭，对扩展开放。一旦系统投产后出现问题就很难解决，因为外观角色没有用抽象约束，一旦需要修改可能会比较麻烦。

## 外观模式的使用场景
+ 为复杂的模块或子系统提供外界访问的模块。 
+ 子系统相对独立。 
+ 预防低水平人员带来的风险，只在指定的子系统中开发。 
