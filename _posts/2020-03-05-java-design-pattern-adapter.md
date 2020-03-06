---
title: Java设计模式——适配器模式
date: 2020-03-05
categories:
- tech
tags:
- java
- design pattern
---

适配器模式是一种结构型设计模式。适配器模式的思想是：把一个类的接口变换成客户端所期待的另一种接口，从而使原本因接口不匹配而无法在一起工作的两个类能够在一起工作。

<!-- more -->

用电器来打个比喻：有一个电器的插头是三脚的，而现有的插座是两孔的，要使插头插上插座，我们需要一个插头转换器，这个转换器即是适配器。

适配器模式涉及3个角色：
+ 源（Adaptee）：需要被适配的对象或类型，相当于插头。
+ 适配器（Adapter）：连接目标和源的中间对象，相当于插头转换器。
+ 目标（Target）：期待得到的目标，相当于插座。

适配器模式包括3种形式：类适配器模式、对象适配器模式、接口适配器模式（或又称作缺省适配器模式）。

## 类适配器模式

从下面的结构图可以看出，Adaptee类并没有method2()方法，而客户端则期待这个方法。为使客户端能够使用Adaptee类，我们把Adaptee与Target衔接起来。Adapter与Adaptee是继承关系，这决定了这是一个类适配器模式。
![](/assets/upload/2020-03/1583392109.png)

代码实现：

源：
```
public class Adaptee {
    public void method1(){
        System.out.println("method 1");
    }
}
```

目标：
```
public interface Target {
    void method1();
    void method2();
}
```
 
适配器：
```
public class Adapter extends Adaptee implements Target {
    @Override
    public void method2() {
        System.out.println("method 2");
    }
}

// 测试
class AdapterTest {
    public static void main(String[] args) {
        Adapter adapter = new Adapter();
        adapter.method1();
        adapter.method2();
    }
}
```

运行结果：
```
method 1
method 2
```

## 对象适配器模式

对象适配器模式是另外6种结构型设计模式的起源。
![](/assets/upload/2020-03/1583391938.png)


从下面的结构图可以看出，Adaptee类并没有method2()方法，而客户端则期待这个方法。与类适配器模式一样，为使客户端能够使用Adaptee类，我们把Adaptee与Target衔接起来。但这里我们不继承Adaptee，而是把Adaptee封装进Adapter里。这里Adaptee与Adapter是组合关系。

![](/assets/upload/2020-03/1583393173.png)
代码实现：

Target和Adaptee和上面的类适配器一样，不再贴出。

适配器：
```
public class Adapter implements Target {

    private Adaptee adaptee;

    public Adapter(Adaptee adaptee) {
        this.adaptee = adaptee;
    }

    @Override
    public void method1() {
        adaptee.method1();
    }

    @Override
    public void method2() {
        System.out.println("method 2");
    }

}

class AdapterTest {
    public static void main(String[] args) {
        Adapter adapter = new Adapter(new Adaptee());
        adapter.method1();
        adapter.method2();
    }
}
```

运行结果：
```
method 1
method 2
```

类适配器与对象适配器的区别

类适配器使用的是继承的方式，直接继承了Adaptee，所以无法对Adaptee的子类进行适配。

对象适配器使用的是组合的方式，所以Adaptee及其子孙类都可以被适配。另外，对象适配器对于增加一些新行为非常方便，而且新增加的行为同时适用于所有的源。

基于组合/聚合优于继承的原则，使用对象适配器是更好的选择。但具体问题应该具体分析，某些情况可能使用类适配器会适合，最适合的才是最好的。

JDK中的HashSet从某中角度来看可以认为是HashMap的对象适配器实现，实现了Set接口，包含了HashMap。

## 接口适配器模式（缺省适配模式）

接口适配器模式（缺省适配模式）的思想是，为一个接口提供缺省实现，这样子类可以从这个缺省实现进行扩展，而不必从原有接口进行扩展。

这里提供一个例子。java.awt.KeyListener是一个键盘监听器接口，我们把这个接口的实现类对象注册进容器后，这个容器就会对键盘行为进行监听，像这样：
```
public static void main(String[] args) {
    JFrame frame = new JFrame();
    frame.addKeyListener(new KeyListener() {
        @Override
        public void keyTyped(KeyEvent e) {}

        @Override
        public void keyPressed(KeyEvent e) {
            System.out.println("hey geek!");
        }

        @Override
        public void keyReleased(KeyEvent e) {
        }
    });
}
```


可以看到其实我们只使用到其中一个方法，但必须要把接口中所有方法都实现一遍，如果接口里方法非常多，那岂不是非常麻烦。于是我们引入一个默认适配器，让适配器把接口里的方法都实现一遍，使用时继承这个适配器，把需要的方法实现一遍就好了。JAVA里也为java.awt.KeyListener提供了这样一个适配器：java.awt.KeyAdapter。我们使用这个适配器来改改上面的代码：
```
public static void main(String[] args) {
    JFrame frame = new JFrame();
    frame.addKeyListener(new KeyAdapter() {
        @Override
        public void keyPressed(KeyEvent e) {
            System.out.println("fxcku!");
        }
    });
}
```

这样不必再把每个方法都实现一遍，代码看起来简洁多了。在任何时候，如果不准备实现一个接口里的所有方法时，就可以使用“缺省适配模式”制造一个抽象类，实现所有方法，这样，从这个抽象类再继承下去的子类就不必实现所有的方法，只要重写需要的方法就可以了。


## 适配器模式的优缺点

+ 优点
  + 更好的复用性：系统需要使用现有的类，而此类的接口不符合系统的需要。那么通过适配器模式就可以让这些功能得到更好的复用。
  + 更好的扩展性：在实现适配器功能的时候，可以扩展自己源的行为（增加方法），从而自然地扩展系统的功能。
+ 缺点
  + 会导致系统紊乱：滥用适配器，会让系统变得非常零乱。例如，明明看到调用的是A接口，其实内部被适配成了B接口的实现，一个系统如果太多出现这种情况，无异于一场灾难。因此如果不是很有必要，可以不使用适配器，而是直接对系统进行重构。

## 适配器模式的应用场景

适配器模式的主要意图是接口转换，把一个对象的接口转换为系统希望的另外一个接口，这里的系统指的不仅仅是一个应用，也可能是某个环境，比如通过接口转换可以屏蔽外界接口，以免外界接口深入系统内部，从而提高系统的稳定性和可靠性。

+ 类适配器与对象适配器的使用场景一致，仅仅是实现手段稍有区别，二者主要用于如下场景：

    + 想要使用一个已经存在的类，但是它却不符合现有的接口规范，导致无法直接去访问，这时创建一个适配器就能间接去访问这个类中的方法。

    + 我们有一个类，想将其设计为可重用的类（可被多处访问），我们可以创建适配器来将这个类来适配其他没有提供合适接口的类。

以上两个场景其实就是从两个角度来描述一类问题，那就是要访问的方法不在合适的接口里，一个从接口出发（被访问），一个从访问出发（主动访问）。

+ 接口适配器使用场景：

    + 想要使用接口中的某个或某些方法，但是接口中有太多方法，我们要使用时必须实现接口并实现其中的所有方法，可以使用抽象类来实现接口，并不对方法进行实现（仅置空），然后我们再继承这个抽象类来通过重写想用的方法的方式来实现。这个抽象类就是适配器。

## 参考
[https://blog.csdn.net/mrkohaku/article/details/79087688](https://blog.csdn.net/mrkohaku/article/details/79087688)