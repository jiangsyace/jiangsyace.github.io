---
title: Java设计模式——桥接模式
date: 2020-03-06
categories:
- tech
tags:
- java
- design pattern
---

桥接模式是一种结构型设计模式。桥接模式的思想是：将抽象部分与它的实现分离，使它们可以独立变化。实现系统可能有多个角度分类，每一种角度都可能变化，那么将多角度分离出来让它们独立变化，减少它们之间的耦合。

<!-- more -->

桥我们大家都熟悉，顾名思义就是用来将河的两岸联系起来的。而此处的桥是用来将两个独立的结构联系起来，而这两个被联系起来的结构可以独立的变化，所有其他的理解只要建立在这个层面上就会比较容易。

下面是一些官方的说明，比较晦涩，必须等你有一定的经验后才能理解： 1. 如果一个系统需要在抽象化和具体化之间增加更多的灵活性，避免在两个层次之间建立静态的继承关系，通过桥接模式可以使它们在抽象层建立一个关联关系。

+ “抽象部分”和“实现部分”可以以继承的方式独立扩展而互不影响，在程序运行时可以动态将一个抽象化子类的对象和一个实现化子类的对象进行组合，即系统需要对抽象化角色和实现化角色进行动态耦合。
+ 一个类存在两个（或多个）独立变化的维度，且这两个（或多个）维度都需要独立进行扩展。
+ 对于那些不希望使用继承或因为多层继承导致系统类的个数急剧增加的系统，桥接模式尤为适用。


## 桥接模式的结构图

![](/assets/upload/2020-03/1583489727.png)

桥接模式涉及4个角色：
+ Implementor，实现类接口。
+ ConcreteImplementor，具体实现类。
+ Abstraction，抽象类。
+ RefinedAbstraction，修正抽象类。

## 桥接模式的实现

抽象角色：抽象化给出的定义，并保存一个对实现化对象的引用。它声明了一个方法request()，并给出了它的实现。这个实现是通过调用实现化对象的doSomething()方法实现的。
```
public abstract class Abstraction {

	//定义对实现化角色的引用
	private Implementor imp;
	
	//约束子类必须实现该构造函数
	public Abstraction(Implementor _imp){
		this.imp = _imp;
	}
	
	//自身的行为和属性
	public void request(){
		this.imp.doSomething();
	}
	
	//获得实现化角色
	public Implementor getImp(){
		return imp;
	}
}

```

修正抽象化角色
```
public class RefinedAbstraction extends Abstraction {
	
	//覆写构造函数
	public RefinedAbstraction(Implementor _imp){
		super(_imp);
	}
	
	//修正父类的行文
	@Override
	public void request(){
		/*
		 * 业务处理....
		 */
		super.request();
		
		super.getImp().doAnything();
	}
}
```

实现化角色
```
public interface Implementor {
	
	//基本方法
	public void doSomething();
	
	public void doAnything();
}
```

具体实现化角色
```
public class ConcreteImplementor1 implements Implementor{
	public void doSomething(){
		//业务逻辑处理
	}
	public void doAnything(){
		//业务逻辑处理
	}
}

public class ConcreteImplementor2 implements Implementor{
	public void doSomething(){
		//业务逻辑处理
	}
	public void doAnything(){
		//业务逻辑处理
	}
}
```

调用过程：
```
public class Client {
	public static void main(String[] args) {
		//定义一个实现化角色
		Implementor imp = new ConcreteImplementor1();
		//定义一个抽象化角色
		Abstraction abs = new RefinedAbstraction(imp);
		//执行行文
		abs.request();
	}
}
```
## 桥接模式的优缺点

+ 优点：
    + 实现了抽象和实现部分的分离，从而极大的提供了系统的灵活性，让抽象部分和实现部分独立开来，分别定义接口，这有助于系统进行分层设计，从而产生更好的结构化系统。对于系统的高层部分，只需要知道抽象部分和实现部分的接口就可以了。
    + 更好的可扩展性，抽象部分和实现部分可以分别独立扩展，而不会相互影响，大大的提供了系统的可扩展性，在两个变化维度中任意扩展一个维度，都不需要修改原有系统，符合“开闭原则”。
    + 可动态的切换实现，由于桥接模式实现了抽象和实现的分离，所以在实现桥接模式时，就可以实现动态的选择和使用具体的实现。
    + 实现细节对客户端透明，可以对用户隐藏实现细节。

+ 缺点：
    + 桥接模式的使用会增加系统的理解与设计难度，由于关联关系建立在抽象层，要求开发者一开始就针对抽象层进行设计与编程。
    + 桥接模式要求正确识别出系统中两个独立变化的维度，因此其使用范围具有一定的局限性。

## 桥接模式的应用场景
桥梁模式是在抽象层产生耦合，解决的是自行扩展的问题，它可以使两个有耦合关系的对象互不影响的扩展，比如对于使用笔画图这样的需求，可以采用桥梁模式设计成用什么笔（铅笔、毛笔）画什么图（圆形、方形）的方案，至于以后需求的变更，如增加笔的类型，增加图形等，对该设计来说是小菜一碟。

JDBC的实现过程就采用了桥接模式。
![](/assets/upload/2020-03/hslDSbR.png)

## 参考
[https://www.cnblogs.com/-crazysnail/p/3977815.html](https://www.cnblogs.com/-crazysnail/p/3977815.html)

[https://segmentfault.com/a/1190000011931181](https://segmentfault.com/a/1190000011931181)