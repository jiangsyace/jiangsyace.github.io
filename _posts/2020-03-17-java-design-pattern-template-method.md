---
title: Java设计模式——模版方法模式
date: 2020-03-17
categories:
- tech
tags:
- java
- design pattern
---

模板方法模式（Template Method）定义一个操作中的算法的框架，而将一些步骤延迟到子类中。使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。

<!-- more -->

模板方法模式确实非常简单，仅仅使用了Java的继承机制，但它是一个应用非常广泛的模式。

模板方法模式涉及到了2个角色：
- 抽象模板角色：定义一组基本方法供子类实现，定义并实现组合了基本方法的模板方法。
- 具体模板角色：实现抽象模板角色定义的基本方法

模板方法模式还涉及到以下方法的概念：

+ 基本方法
	+ 抽象方法：由抽象模板角色声明，`abstract`修饰，具体模板角色实现。
	+ 钩子方法：由抽象模板角色声明并实现，具体模板角色可实现加以扩展。
	+ 具体方法：由抽象模板角色声明并实现，而子类并不实现。
+ 模板方法
抽象模板角色声明并实现，负责对基本方法的调度，一般以final修饰，不允许具体模板角色重写。模板方法一般也是一个具体方法。

类图结构如下：

![](/assets/upload/2020-03/1584414822.png)


## 模板方法模式的实现

```
//抽象模板类
public abstract class AbstractClass { 
    /**
     * 基本方法，子类需要实现
     */
    protected abstract void doSomething(); 
    protected abstract void doAnything(); 
    /**
     * 模板方法，负责调度基本方法，子类不可实现
     */
    public final void templateMethod() { 
        this.doAnything(); 
        this.doSomething(); 
    }
}

//具体模板类
public class ConcreteClass1 extends AbstractClass { 
    protected void doAnything() { 
        //业务逻辑处理 
    } 
    protected void doSomething() { 
        //业务逻辑处理 
    }
}

public class ConcreteClass2 extends AbstractClass { 
    protected void doAnything() { 
        //业务逻辑处理 
    } 
    protected void doSomething() { 
        //业务逻辑处理
    }
}

public class Client { 
    public static void main(String[] args) { 
        AbstractClass class1 = new ConcreteClass1(); 
        AbstractClass class2 = new ConcreteClass2(); 
        class1.templateMethod(); 
        class2.templateMethod(); 
    }
}
```

## 模板方法模式的适用场景 

+ 多个子类有公共的方法，并且逻辑基本相同时。
+ 重要、复杂的算法，可以把核心算法设计为模板方法，周边相关细节功能则由各个子类实现。
+ 重构时，模板方法是一个经常使用的模式，把相同的代码抽取到父类中，然后通过钩子函数约束其行为。

## 模板方法模式的优缺点
+ 优点：
	+ 封装不变部分，扩展可变部分。
	+ 提取公共代码，便于维护。
	+ 行为由父类控制，子类实现，因此可以通过扩展的方式增加响应的功能，符合开闭原则。
+ 缺点：
	+ 每一个不同的实现都需要一个子类来实现，导致类的个数增加，使得系统更加庞大。
