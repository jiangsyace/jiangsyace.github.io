---
title: Java设计模式——状态模式
date: 2020-03-19
categories:
- tech
tags:
- java
- design pattern
---

状态模式（State）中，类的行为是基于它的状态改变的。这种类型的设计模式属于行为型模式。

<!-- more -->

状态模式涉及到了3个角色：
+ 抽象状态角色（State）：接口或抽象，负责对象状态的定义，并且封装环境角色一实现状态切换。
+ 具体状态角色（ConcreteSate）：每一个具体状态必须完成两个职责：本状态的行为管理以及趋向状态管理，通俗的说，就是本状态下要做的事，以及本状态如何过渡到其他状态。
+ 环境角色（Context）：定义客户端需要的接口，并且负责具体状态的切换。

类图结构如下：

![](/assets/upload/2020-03/1584580873.png)


## 状态模式的实现

抽象状态角色
```
public abstract class State {
    //定义一个环境角色，提供子类访问
    protected Context context;
    //设置环境角色
    public void setContext(Context _context){
        this.context = _context;
    }
    //行为1
    public abstract void handle1();
    
    //行为2
    public abstract void handle2();
}
```

具体状态角色有两个职责：处理本状态需要完成的任务，决定是否可以过渡到其他状态
```
public class ConcreteState1 extends State {
    @Override
    public void handle1() {
        //本状态下必须处理的逻辑
    }
    @Override
    public void handle2() {
        //设置当前状态为stat2
        super.context.setCurrentState(Context.STATE2);
        //过渡到state2状态，由Context实现
        super.context.handle2();
    }
}
public class ConcreteState2 extends State {
    @Override
    public void handle1() {
        //设置当前状态为stat1
        super.context.setCurrentState(Context.STATE1);
        //过渡到state1状态，由Context实现
        super.context.handle1();
    }
    @Override
    public void handle2() {
        //本状态下必须处理的逻辑
    }
}
```

环境角色有两个不成文的约束：
+ 把状态对象声明为静态常量，有几个状态对象就声明几个静态常量。
+ 环境角色具有抽象状态角色定义的所有行为，具体执行使用委托方式。
```
public class Context {
    //定义状态
    public final static State STATE1 = new ConcreteState1();
    public final static State STATE2 = new ConcreteState2();
    
    //当前状态
    private State CurrentState;
    
    //获得当前状态
    public State getCurrentState() {
        return CurrentState;
    }
    
    //设置当前状态
    public void setCurrentState(State currentState) {
        this.CurrentState = currentState;
        //切换状态
        this.CurrentState.setContext(this);
    }
    
    //行为委托
    public void handle1(){
        this.CurrentState.handle1();
    }
    
    public void handle2(){
        this.CurrentState.handle2();
    }
}
```

调用过程中，隐藏了状态变化的过程。
```
public class Client {
    public static void main(String[] args) {
        //定义环境角色
        Context context = new Context();
        //初始化状态
        context.setCurrentState(new ConcreteState1());
        //行为执行
        context.handle1();
        context.handle2();
    }
}
```

## 状态模式的适用场景 

状态模式主要解决的是当控制一个对象状态转换的条件表达式过于复杂时的情况，把状态的判断逻辑转移到表示不同状态的一系列的类中，可以把复杂逻辑简化。

即当对象的行为取决于它的状态时，并且必须在运行时刻根据状态改变他的行为时，可以考虑使用状态模式。

## 状态模式的优缺点
+ 优点：
    + 结构清晰，避免了过多的`switch...case`或者`if...else`语句的使用，避免了程序的复杂性，提高系统的可维护性。
    + 封装性非常好，状态变换放置到类的内部来实现，外部的调用不知道类的内部如何实现状态和行为的变换。
+ 缺点：
    + 子类太多会造成类膨胀，因为可能一个事务会有很多状态，如果完全使用状态模式也不好管理，我们需要根据具体情况去衡量。
