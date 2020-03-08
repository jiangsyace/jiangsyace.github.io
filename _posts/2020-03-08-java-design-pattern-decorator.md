---
title: Java设计模式——装饰模式
date: 2020-03-08
categories:
- tech
tags:
- java
- design pattern
---

装饰模式是一种结构型设计模式，又叫做包装模式，旨在不改变原有对象的基础上附加功能，就增加功能来说，相比生成子类更为灵活。跟继承的区别就在于，继承的局限在于子类只能增强一个父类，而装饰者它可以对某一类的对象进行增强，这样就避免了冗余的继承体系。

<!-- more -->

使用场景：动态的给一个对象添加或者撤销功能。

装饰模式涉及4个角色：

+ 抽象构件(Component)角色：给出一个抽象接口，以规范准备接收附加责任的对象。
+ 具体构件(ConcreteComponent)角色：定义一个将要接收附加责任的类。
+ 装饰(Decorator)角色：持有一个构件(Component)对象的实例，并定义一个与抽象构件接口一致的接口。
+ 具体装饰(ConcreteDecorator)角色：负责给构件对象“贴上”附加的责任。


类图结构如下：

![](/assets/upload/2020-03/1583624347.png)

**装饰模式与代理模式的区别**

从类图上看，装饰模式与代理模式的结构很像，只是它们的目的不同，所以使用方法和适用场景上也就不同：

+ 代理模式专注于对被代理对象的访问。
+ 装饰模式专注于对被装饰对象附加额外功能。

**装饰模式与责任链模式的区别**

装饰模式的请求转发过程很像责任链模式，只不过，责任链模式在转发请求过程中，最多只有一个对象会处理请求，而装饰模式则有多个对象处理一个请求。

**装饰模式与继承的区别**

一个包装类可以对同一接口的多种实现类进行包装，这样的实现方式就是可插拔式的，动态的，包装类甚至就像是一个工具类一样。

如果使用继承，那么包装类的定位就是被包装类的子类，且若要对多个对象都增强同一种功能，就必须创建多个类，显而易见，装饰者模式胜出！

## 装饰模式的实现

抽象构件，定义被包装对象的方法，可以是抽象类，也可以是接口。
```
public abstract class Component {
	//抽象的方法
	public abstract void operate();
}

```

具体构件，就是被装饰的对象，实现需要被装饰的方法。
```
public class ConcreteComponent extends Component {
	//具体实现
	@Override
	public void operate() {
		System.out.println("do Something");
	}
}

```

装饰类，用来装饰包含的抽象构件，这里也可以直接使用普通类，实现抽象构件的接口。
```
public abstract class Decorator extends Component {
	private Component component = null;
	
	//通过构造函数传递被修饰者
	public Decorator(Component _component){
		this.component = _component;
	}
	
	//委托给被修饰者执行
	@Override
	public void operate() {
		this.component.operate();
	}

}
```

具体装饰类，实现修饰的方法
```
public class ConcreteDecorator1 extends Decorator {
	//定义被修饰者
	public ConcreteDecorator1(Component _component){
		super(_component);
	}
	
	//定义自己的修饰方法
	private void method1(){
		System.out.println("method1 修饰");
	}
	
	//重写父类的Operation方法
	public void operate(){
		this.method1();
		super.operate();
	}
}

```

具体装饰类，实现修饰的方法
```
public class ConcreteDecorator2 extends Decorator {
	//定义被修饰者
	public ConcreteDecorator2(Component _component){
		super(_component);
	}
	
	//定义自己的修饰方法
	private void method2(){
		System.out.println("method2修饰");
	}
	
	//重写父类的Operation方法
	public void operate(){
		super.operate();
		this.method2();
	}
}

```

调用过程
```
public class Client {
	public static void main(String[] args) {
		Component component = new ConcreteComponent();
		//第一次修饰
		component = new ConcreteDecorator1(component);
		//第二次修饰
		component = new ConcreteDecorator2(component);
		//修饰后运行
		component.operate();
	}
}
```

## 装饰模式的优缺点

+ 优点：可以不改变原有对象的情况下动态扩展功能，可以使扩展的多个功能按想要的顺序执行，以实现不同效果。
+ 缺点：更多的相似的子类，使程序复杂。

## 装饰模式的使用场景

+ 给系统添加日志，安全、限流，将这些业务无关代码抽离出来，可以根据需要动态地扩展。

+ Java IO流中Inputstream运用了装饰模式。例如充当装饰功能的IO类如BufferedInputStream等，又被称为高级流，通常将基本流作为高级流构造器的参数传入，将其作为高级流的一个关联对象，从而对其功能进行扩展和装饰。其实BufferedInputStream和用FileInputStream去read一个文件实际使用方式上是一样的，能用FileInputStream.read()，就能用BufferedInputStream.read()，只不过，BufferedInputStream把FileInputStream包装了一下，增加了一个缓存，并不控制底层FileInputStream的read()行为。

```
public class BufferedInputStream extends FilterInputStream {

	public BufferedInputStream(InputStream in) {
			this(in, DEFAULT_BUFFER_SIZE);
	}	
	public synchronized int read() throws IOException {
			if (pos >= count) {
					fill();
					if (pos >= count)
							return -1;
			}
			return getBufIfOpen()[pos++] & 0xff;
	}
}
```

+ Spring Session中的ServletRequestWrapper（Response也一样）的装饰模式。

```
public class ServletRequestWrapper implements ServletRequest {
    private ServletRequest request;//组合抽象接口到自己的类中

    public ServletRequestWrapper(ServletRequest request) {
        if(request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        } else {
            this.request = request;
        }
    }

    public ServletRequest getRequest() {
        return this.request;
    }

    public void setRequest(ServletRequest request) {
        if(request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        } else {
            this.request = request;
        }
    }
   //省略...
}
```

