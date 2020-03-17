---
title: Java设计模式——建造者模式
date: 2020-03-13
categories:
- tech
tags:
- java
- design pattern
---

建造者模式（Builder）是一种创建型模式。它的定义是：将一个复杂的对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

<!-- more -->

通俗的讲，创建一个对象一般都会有一个固定的步骤，这个固定的步骤我们把它抽象出来，每个抽象步骤都会有不同的实现方式，不同的实现方式创建出的对象也将不同。比如说我们在组装电脑的时候其实就是属于建造者模式，电脑的组装都需要安装CPU、内存条、硬盘等元器件。我们可以把这个安装步骤抽象出来，至于到底装哪种CPU，比如i5还是i7就是对该抽象安装步骤的具体实现。

类图结构如下：

![](/assets/upload/2020-03/1584066420.png)

建造者模式涉及4个角色：
+ 产品类（Product）：具体的产品，通常实现了模版方法模式，也就是具有模版方法和基本方法。
+ 抽象建造者（Builder）：规范了产品的组建，一般是由子类实现。
+ 具体建造者（ConcreteBuilder）：实现抽象类定义的所有方法，并且返回一个组建好的对象。
+ 导演类（Director）：调用具体构造者创建的产品对象，负责将客户端传来指令交给具体的建造者。

## 建造者模式的实现

产品类
```
public class Product {
    public void doSomething() {
        //独立业务处理
    }
}
```

抽象建造者
```
public abstract class Builder {
    //设置产品的不同部分，以获得不同的产品
    public abstract void setPart();
    //建造产品
    public abstract Product buildProduct();
}
```

具体建造者
```
public class ConcreteProduct extends Builder {
    private Product product = new Product();
    //设置产品零件
    public void setPart(){
        /*
         * 产品类内的逻辑处理
         */
    }
    
    //组建一个产品
    public Product buildProduct() {
        return product;
    }
}
```

导演类
```
public class Director {
    private Builder builder = new ConcreteProduct();
    //构建不同的产品
    public Product getAProduct() {
        builder.setPart();
        /*
         * 设置不同的零件，产生不同的产品
         */
        return builder.buildProduct();
    }
}
```

## 建造者模式的使用场景

+ 当一个类的构造函数参数个数超过4个，而且这些参数有些是可选的参数，考虑使用构造者模式。

## 建造者模式的优缺点

+ 优点
	+ 易于解耦，将产品本身与产品创建过程进行解耦，可以使用相同的创建过程来得到不同的产品。也就说细节依赖抽象。
	+ 易于精确控制对象的创建，将复杂产品的创建步骤分解在不同的方法中，使得创建过程更加清晰
	+ 易于拓展，增加新的具体建造者无需修改原有类库的代码，易于拓展，符合“开闭原则”。每一个具体建造者都相对独立，而与其他的具体建造者无关，因此可以很方便地替换具体建造者或增加新的具体建造者，用户使用不同的具体建造者即可得到不同的产品对象。
+ 缺点
	+ 建造者模式所创建的产品一般具有较多的共同点，其组成部分相似；如果产品之间的差异性很大，则不适合使用建造者模式，因此其使用范围受到一定的限制。
	+ 如果产品的内部变化复杂，可能会导致需要定义很多具体建造者类来实现这种变化，导致系统变得很庞大。
