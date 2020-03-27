---
title: Java设计模式——命令模式
date: 2020-03-26
categories:
- tech
tags:
- java
- design pattern
---

命令模式(Command)：将一个请求封装为一个对象，从而让我们可用不同的请求对客户进行参数化；对请求排队或者记录请求日志，以及支持可撤销的操作。命令模式是一种对象行为型模式，其别名为动作(Action)模式或事务(Transaction)模式。

<!-- more -->

命令模式的核心在于引入了命令类，通过命令类来降低发送者和接收者的耦合度，请求发送者只需指定一个命令对象，再通过命令对象来调用请求接收者的处理方法，其结构如图所示：

![](/assets/upload/2020-03/1585187529.png)

在命令模式结构图中包含如下几个角色：

+ Command（抽象命令类）：抽象命令类一般是一个抽象类或接口，在其中声明了用于执行请求的execute()等方法，通过这些方法可以调用请求接收者的相关操作。
+ ConcreteCommand（具体命令类）：具体命令类是抽象命令类的子类，实现了在抽象命令类中声明的方法，它对应具体的接收者对象，将接收者对象的动作绑定其中。在实现execute()方法时，将调用接收者对象的相关操作(Action)。
+ Invoker（调用者）：调用者即请求发送者，它通过命令对象来执行请求。一个调用者并不需要在设计时确定其接收者，因此它只与抽象命令类之间存在关联关系。在程序运行时可以将一个具体命令对象注入其中，再调用具体命令对象的execute()方法，从而实现间接调用请求接收者的相关操作。
+ Receiver（接收者）：接收者执行与请求相关的操作，它具体实现对请求的业务处理。

## 命令模式的实现

抽象命令类
```
public abstract class Command {
    //每个命令类都必须有一个执行命令的方法
    public abstract void execute();
}
```

具体命令类
```
public class ConcreteCommand1 extends Command {
    //也对那个Receiver类进行命令处理
    private Receiver receiver;
    
    //构造函数传递接收者
    public ConcreteCommand1(Receiver _receiver){
        this.receiver = _receiver;
    }
    
    //每个具体的命令都必须实现一个命令
    public void execute() {
        //业务处理
        this.receiver.doSomething();
    }
}
public class ConcreteCommand2 extends Command {
    //也对那个Receiver类进行命令处理
    private Receiver receiver;
    
    //构造函数传递接收者
    public ConcreteCommand2(Receiver _receiver){
        this.receiver = _receiver;
    }
    
    //每个具体的命令都必须实现一个命令
    public void execute() {
        //业务处理
        this.receiver.doSomething();
    }
}
```

接收者
```
public abstract class Receiver {
    //抽象接收者，定义每个接收者都必须完成的业务
    public abstract void doSomething();
}

public class ConcreteReciver1 extends Receiver{
    //每个接受者都必须处理一定的业务逻辑
    public void doSomething(){
        
    }
}
public class ConcreteReciver2 extends Receiver{
    //每个接受者都必须处理一定的业务逻辑
    public void doSomething(){
        
    }
}
```

调用者
```
public class Invoker {
    private Command command;
    //受气包，接受命令
    public void setCommand(Command _command){
        this.command = _command;
    }
    
    //执行命令
    public void action(){
        this.command.execute();
    }
}
```

调用过程
```
public class Client {
    public static void main(String[] args) {
        //首先声明出调用者Invoker
        Invoker invoker = new Invoker();
        
        //定义接收者
        Receiver receiver = new ConcreteReciver1();
        
        //定义一个发送给接收者的命令
        Command command = new ConcreteCommand1(receiver);
        
        //把命令交给调用者去执行
        invoker.setCommand(command);
        invoker.action();
    }
}
```

## 命令模式的适用场景 

+ 涉及到“命令”、“操作”或者“控制”的场景，一般都是命令模式的适用场景。

## 命令模式的优缺点

+ 优点：
	+ 将请求调用者和执行者解耦，适用于底层接口封装，可以通过只增加类就可以实现接口扩展，不需要修改原来的代码。

+ 缺点：
	+ 如果存在较多的命令或者请求，需要较多的命令类。
