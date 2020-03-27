---
title: Java设计模式——责任链模式
date: 2020-03-27
categories:
- tech
tags:
- java
- design pattern
---

责任链模式（Chain of Responsibility）为请求创建了一个接收者对象的链。这种模式给予请求的类型，对请求的发送者和接收者进行解耦。这种类型的设计模式属于行为型模式。

<!-- more -->

责任链模式避免请求发送者与接收者耦合在一起，让多个对象都有可能接收请求，将这些对象连接成一条链，并且沿着这条链传递请求，直到所有对象处理它为止。

在责任链模式结构图中包含如下几个角色：

+ 抽象处理者（Handler）：定义出一个处理请求的接口，抽象方法handleRequest()规范子类处理请求的操作。
+ 具体处理者（ConcreteHandler） : 具体处理者接到请求后，可以选择将请求处理掉，或者将请求传给下家。

## 责任链模式的实现

抽象处理者
```
public abstract class AbstractHandler  {
    //判断下一个处理者是谁
    private AbstractHandler nextHandler = null;

    public final Response handlerRequest(MyRequest request) {
        Response response = null;

        if(this.getHandlerLevel()==request.getLevel()) {
            response = this.response(request);
        }else {
            if(this.nextHandler != null) {
                System.out.println("转到下一个处理者中...");
                response = this.nextHandler.handlerRequest(request);
            }else {
                System.out.println("后面没有处理请求了...");
            }
        }
        return response;
    }
    public void setNextHandler(AbstractHandler handler) {
        nextHandler = handler;
    }
    //拿到等级
    protected abstract int getHandlerLevel();
    //响应
    protected abstract Response response(MyRequest request);
}
```

具体处理者
```
public class ConcreteHandlerA extends AbstractHandler {
    @Override
    protected int getHandlerLevel() {
        return 0;
    }

    @Override
    protected Response response(MyRequest request) {
        System.out.println("ConcreteHandlerA 正在处理中");
        return new Response("响应处理结果A") ;
    }
}
public class ConcreteHandlerB extends AbstractHandler {
    @Override
    protected int getHandlerLevel() {
        return 1;
    }

    @Override
    protected Response response(MyRequest request) {
        System.out.println("ConcreteHandlerB 正在处理中“");
        return new Response("响应处理结果B") ;
    }
}
```

等级类
```
public class Level {
    private int level = 1;
    public Level(int level){
        this.level = level;
    }
    public int getLevel() {
        return level;
    }
}
```

请求类
```
public class MyRequest {
    Level level;
    public MyRequest(Level level){
        this.level=level;
    }
    public int getLevel(){
        return level.getLevel();
    }
}
```

响应类
```
public class Response {
    private String message;
    public Response(String message) {
        System.out.println("处理完成");
        this.message = message;
    }
    public String getMessage() {
        return message;
    }
}
```

调用过程
```
public class Client {
    public static void main(String[] args) {
        AbstractHandler handler1 = new ConcreteHandlerA();
        AbstractHandler handler2 = new ConcreteHandlerB();
        //A到B组成一个链
        handler1.setNextHandler(handler2);
        Response response = handler1.handlerRequest(new MyRequest(new Level(1)));
	}
}
```

## 责任链模式的适用场景 

+ 有多个对象可以处理同一个请求，具体哪个对象处理该请求由运行时刻自动确定。
+ 在不明确指定接收者的情况下，向多个对象中的一个提交一个请求。 
+ 在JavaWeb中过滤器链的实现，实际上就是一种责任链模式


## 责任链模式的优缺点

+ 优点：
	+ 解耦请求者和发送者。
	+ 简化具体责任对象，因为它不知道链的结构，只要处理自己对应的工作即可。
	+ 可以动态的增加或者删除责任对象。

+ 缺点：
	+ 责任链太长或者每条链判断处理的时间太长会影响性能，特别是递归循环的时候。
	+ 责任链太长也会导致调试不是很方便
