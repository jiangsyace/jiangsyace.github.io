---
title: Java设计模式——观察者模式
date: 2020-03-20
categories:
- tech
tags:
- java
- design pattern
---

观察者模式（Observer）又叫做发布-订阅模式，定义了对象间一对多的依赖关系，使得当对象状态发生变化时，所有依赖它的对象都会收到通知并且自动更新自己。这种类型的设计模式属于行为型模式。

<!-- more -->

观察者模式中涉及到了如下几种角色：
+ 抽象主题角色（Subject）：抽象主题角色把所有的观察者对象的引用保存在一个列表里；每个主题都可以有任何数量的观察者。主题提供一个接口，可以加上或撤销观察者对象；主题角色又被称为被观察者角色。可以用抽象类或接口来实现。
+ 抽象观察者角色（Observer）：为所有的具体观察者定义一个接口，在得到通知时更新自己。抽象观察者角色通常是用一个抽象类或一个接口来实现；当然也可以用具体的类来实现。
+ 具体主题角色（ConcreteSubject）：具体主题保存对具体观察者对象有用的内部状态，在这种状态改变时，给其观察者发出一个具体的通知，具体主题角色又被称为具体被观察者角色。
+ 具体观察者角色（ConcreteObserver）：具体观察者角色用于保存一个指向具体主题对象的引用，和一个与主题的状态相符的状态。具体观察者角色实现抽象观察者角色所要求的更新自己的接口，以便使本身的状态与主题的状态对应。


类图结构如下：

![](/assets/upload/2020-03/1584673624.png)


## 观察者模式的实现

抽象主题角色
```
public abstract class Subject {
    //定义一个观察者数组
    private Vector<Observer> obsVector = new Vector<Observer>();
    
    //增加一个观察者
    public void addObserver(Observer o) {
        this.obsVector.add(o);
    }
    
    //删除一个观察者
    public void delObserver(Observer o) {
        this.obsVector.remove(o);
    }
    
    //通知所有观察者
    public void notifyObserver() {
        for (Observer o : this.obsVector) {
            o.update();
        }
    }
}
```

抽象观察者角色
```
public interface Observer {
    //更新方法
    void update();
}
```

具体主题角色
```
public class ConcreteSubject extends Subject {
    //具体的业务
    public void doSomething() {
        /*
         * do something
         */
        super.notifyObserver();
    }
}
```

具体观察者角色
```
public class ConcreteObserver implements Observer {
    //实现更新方法
    public void update() {
        System.out.println("接收到信息，并进行处理！");
    }
}
```

调用过程：
```
public class Client {
    public static void main(String[] args) {
        //创建一个被观察者
        ConcreteSubject subject = new ConcreteSubject();
        //定义一个观察者
        Observer obs= new ConcreteObserver();
        //添加观察者
        subject.addObserver(obs);
        //被观察者开始活动了
        subject.doSomething();
    }
}

```

## 状态模式的适用场景 

观察者模式是一种使用频率比较高的设计模式，凡是涉及到一对一或一对多的对象交互场景都可以使用观察者模式。在Java中已经提供了Observable类以及一个Observer接口，也就是说Java已经实现了观察者模式的定义，可看出观察者模式在程序系统中的使用率是很高的。

+ 一个对象的改变将会导致一个或多个对象的改变，不清楚具体有多少对象以及这些被影响的对象是谁的情况。
+ 如果有这样一个影响链的情况下也可以使用，例如A的改变会影响B，B的改变会影响C...，可以使用观察者模式设计一个链式触发机制。

## 状态模式的优缺点

+ 优点：
    + 观察者模式可以实现表示层和数据逻辑层的分离，定义了稳定的消息更新传递机制，并抽象了更新接口，使得可以有各种各样不同的表示层充当观察者角色。
    + 观察者模式在观察目标和观察者之间建立一个抽象耦合。观察目标只需要维持一个抽象观察者的集合，无须了解其具体观察者。由于观察目标和观察者没有紧密地耦合在一起，因此它们可以属于不同的抽象化层次。
    + 观察者模式支持广播通信，观察目标会向所有已注册的观察者对象发送通知，简化了一对多系统设计的难度。
    + 观察者模式满足“开闭原则”的要求，增加新的具体观察者无须修改原有系统代码，在具体观察者与观察目标之间不存在关联关系的情况下，增加新的观察目标也很方便。

+ 缺点：
    + 如果一个观察目标对象有很多直接和间接观察者，将所有的观察者都通知到会花费很多时间。
    + 如果在观察者和观察目标之间存在循环依赖，观察目标会触发它们之间进行循环调用，可能导致系统崩溃。
    + 观察者模式没有相应的机制让观察者知道所观察的目标对象是怎么发生变化的，而仅仅只是知道观察目标发生了变化。
