---
title: Java设计模式——中介者模式
date: 2020-03-23
categories:
- tech
tags:
- java
- design pattern
---


中介者模式（Mediator）是将多个对象之间通信的网状结构转化为星状结构，从而避免多个对象之间的相互耦合，是一种行为型的设计模式。中介者模式的思路就是加入一个中介者对象，所有对象与对象之间的通信，均通过中介者来进行，所以每个对象不再依赖其他的对象。


<!-- more -->




中介者模式中涉及到了如下几种角色：
+ 抽象中介者（Mediator）角色：它是中介者的接口，提供了合作者对象注册与转发合作者对象信息的抽象方法。
+ 具体中介者（ConcreteMediator）角色：实现中介者接口，定义一个 List 来管理合作者对象，协调各个合作者角色之间的交互关系，因此它依赖于合作者角色。
+ 抽象合作者类（Colleague）角色：定义合作者类的接口，保存中介者对象，提供合作者对象交互的抽象方法，实现所有相互影响的合作者类的公共功能。
+ 具体合作者类（ConcreteColleague）角色：是抽象合作者类的实现者，当需要与其他合作者对象交互时，由中介者对象负责后续的交互。

它的类图结构如下：

![](/assets/upload/2020-03/1584957434.png)


## 中介者模式的实现

抽象中介者
```
public abstract class Mediator {
    //定义同事类
    protected ConcreteColleague1 c1;
    protected ConcreteColleague2 c2;
    
    //通过getter/setter方法吧同事类注入进来
    public ConcreteColleague1 getC1() {
        return c1;
    }
    public void setC1(ConcreteColleague1 c1) {
        this.c1 = c1;
    }
    public ConcreteColleague2 getC2() {
        return c2;
    }
    public void setC2(ConcreteColleague2 c2) {
        this.c2 = c2;
    }
    
    //中介者模式的业务逻辑
    public abstract void doSomething1();
    public abstract void doSomething2();
    
}
```

具体中介者
```
public class ConcreteMediator extends Mediator {
    @Override
    public void doSomething1() {
        //调用同事类的方法，只要是public方法都可以调用
        super.c1.selfMethod1();
        super.c2.selfMethod2();
    }

    public void doSomething2() {
        super.c1.selfMethod1();
        super.c2.selfMethod2();
    }
}
```

抽象合作者类
```
public abstract class Colleague {
    protected Mediator mediator;
    public Colleague(Mediator _mediator){
        this.mediator = _mediator;
    }
}
```

具体合作者类
```
public class ConcreteColleague1 extends Colleague {
    //通过构造函数传递中介者
    public ConcreteColleague1(Mediator _mediator){
        super(_mediator);
    }
    
    //自有方法 self-method
    public void selfMethod1(){
        //处理自己的业务逻辑
    }
    
    //依赖方法 dep-method
    public void depMethod1(){
        //处理自己的业务逻辑
        //自己不能处理的业务逻辑，委托给中介者处理
        super.mediator.doSomething1();
        
    }
}

public class ConcreteColleague2 extends Colleague {
    //通过构造函数传递中介者
    public ConcreteColleague2(Mediator _mediator){
        super(_mediator);
    }
    
    //自有方法 self-method
    public void selfMethod2(){
        //处理自己的业务逻辑
    }
    
    //依赖方法 dep-method
    public void depMethod2(){
        //处理自己的业务逻辑
        //自己不能处理的业务逻辑，委托给中介者处理
        super.mediator.doSomething2();
    }
}
```

调用过程
```
public class Client {
    public static void main(String[] args) {
        //创建出中介者，并执行逻辑操作。
        Mediator mediator = new ConcreteMediator();
        mediator.setC1(new ConcreteColleague1(mediator));
        mediator.setC2(new ConcreteColleague2(mediator));
        mediator.doSomething1();
    }
}

```

## 中介者模式的适用场景 

+ 一般存在网状结构的场景，都可以通过中介者模式来进行优化。
+ 一个对象由于引用了其他很多对象并且直接和这些对象通信，导致难以复用该对象。
+ 想通过一个中间类来封装多个类中的行为，而又不想生成太多的子类。可以通过引入中介者类来实现，在中介者中定义对象交互的公共行为，如果需要改变行为则可以增加新的具体中介者类。

## 中介者模式的优缺点

+ 优点：
	+ 降低了对象之间的耦合性，使得对象易于独立地被复用，符合迪米特原则。
	+ 将对象间的一对多关联转变为一对一的关联，提高系统的灵活性，使得系统易于维护和扩展。
+ 缺点：
	+ 当合作者类太多时，中介者的职责将很大，它会变得复杂而庞大，以至于系统难以维护。