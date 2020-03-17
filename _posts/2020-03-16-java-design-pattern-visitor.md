---
title: Java设计模式——访问者模式
date: 2020-03-16
categories:
- tech
tags:
- java
- design pattern
---

访问者模式（Visitor）是对象的行为模式。访问者模式的目的是封装一些施加于某种数据结构元素之上的操作。一旦这些操作需要修改的话，接受这个操作的数据结构则可以保持不变。

<!-- more -->

访问者模式涉及到了6个角色：
+ 抽象访问者角色（Vistor）：为该对象结构中具体元素角色声明一个访问操作接口。
+ 具体访问者（ConcreteVisitor）：每个具体访问者都实现了Vistor中定义的操作。
+ 抽象元素（Element）：声明一个接受操作（`accept()`），以Visitor作为参数。
+ 具体元素（ConcreteElement）：实现了Element中的`accept()`方法，调用Vistor的访问方法以便完成对一个元素的操作。
+ 对象结构（ObjectStructure）：用于存放元素对象，并且提供了遍历其内部元素的方法。它可以结合组合模式来实现，也可以是一个简单的集合对象，如一个List对象或一个Set对象。

## 访问者模式的实现

抽象访问者中设置了同样的名称的方法且方法传参为实现同一接口的不同对象，即受访者元素。
```
public interface Visitor {
    //可以访问哪些对象
    public void visit(ConcreteElement1 el);

    public void visit(ConcreteElement2 el);
}
```

抽象元素
```
public abstract class Element {
    //定义业务逻辑
    public abstract void doSomething();
    
    //允许谁来访问
    public abstract void accept(Visitor visitor);
}
```

具体访问者
```
public class ConcreteVisitor implements Visitor {
    //访问el元素
    public void visit(ConcreteElement1 el) {
        el.doSomething();
    }

    //访问el元素
    public void visit(ConcreteElement2 el) {
        el.doSomething();
    }
}

```

具体元素
```
public class ConcreteElement1 extends Element {
    
    //完善业务逻辑
    public void doSomething() {
        //业务处理
    }
    
    //允许那个访问者访问
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}

public class ConcreteElement2 extends Element {
    //完善业务逻辑
    public void doSomething() {
        //业务处理
    }

    //允许那个访问者访问
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
```

对象结构
```
public class ObjectStruture {
    //对象生成器，这里通过一个工厂方法模式模拟
    public static Element createElement() {
        Random rand = new Random();
        if (rand.nextInt(100) > 50) {
            return new ConcreteElement1();
        } else {
            return new ConcreteElement2();
        }
    }
}
```

客户端调用过程
```
public class Client {
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            //获得元素对象
            Element el = ObjectStruture.createElement();
            //接受访问者访问
            el.accept(new ConcreteVisitor());
        }
    }
}
```

## 访问者模式的适用场景 

+ 有时在对数据结构上的元素进行操作的时候，需要区分具体的类型，这时使用访问者模式可以针对不同的类型，在访问者类中定义不同的操作，从而去除掉类型判断。
+ 当一个数据结构中，一些元素类需要负责与其不相关的操作的时候，为了将这些操作分离出去，以减少这些元素类的职责时，可以使用访问者模式。Visitor使得你可以将相关的操作集中起来定义在一个类中。 
+ 定义对象结构的类很少改变，但经常需要在此结构上定义新的操作。改变对象结构类需要重定义对所有访问者的接口，这可能需要很大的代价，如果对象结构类经常改变，那么可能还是在这些类中定义这些操作较好。

## 访问者模式的优缺点
+ 优点：
	+ 使得数据结构和作用于结构上的操作解耦，使得操作集合可以独立变化。
	+ 添加新的操作或者说访问者会非常容易。
	+ 将对各个元素的一组操作集中在一个访问者类当中。
	+ 使得类层次结构不改变的情况下，可以针对各个层次做出不同的操作，而不影响类层次结构的完整性。
	+ 可以跨越类层次结构，访问不同层次的元素类，做出相应的操作。
+ 缺点：
	+ 增加新的元素会非常困难。
	+ 实现起来比较复杂，会增加系统的复杂性。
	+ 破坏封装，如果将访问行为放在各个元素中，则可以不暴露元素的内部结构和状态，但使用访问者模式的时候，为了让访问者能获取到所关心的信息，元素类不得不暴露出一些内部的状态和结构，就像收入和支出类必须提供访问金额和单子的项目的方法一样。
