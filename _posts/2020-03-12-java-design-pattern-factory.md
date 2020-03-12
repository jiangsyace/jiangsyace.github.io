---
title: Java设计模式——工厂模式
date: 2020-03-12
categories:
- tech
tags:
- java
- design pattern
---

工厂方法模式是一种创建型设计模式。工厂顾名思义就是创建产品，根据产品是具体产品还是具体工厂可分为简单工厂模式和工厂方法模式，根据工厂的抽象程度可分为工厂方法模式和抽象工厂模式。该模式用于封装和管理对象的创建，是一种创建型模式。本文从一个具体的例子逐步深入分析，来体会三种工厂模式的应用场景和利弊。

<!-- more -->


## 简单工厂模式(Simple Method)

简单工厂模式是一个由工厂对象决定创建出哪一种产品类的实例，又叫静态工厂方法模式。

类图结构如下：

![](/assets/upload/2020-03/1584023443.png)

简单工厂模式涉及3个角色：
+ 工厂角色（Factory）：根据内部逻辑返回相应的产品
+ 抽象产品角色（Product）：提供抽象方法供具体产品类实现
+ 具体产品角色（ConcreteProduct）：提供具体的产品

抽象产品角色
```
public abstract class Product {
	public abstract void doSomething();

}
```

具体产品角色
```
public class ConcreteProduct1 extends Product {
	public void doSomething() {
		//逻辑处理
	}
}

public class ConcreteProduct2 extends Product {
	public void doSomething() {
		//逻辑处理
	}
}

```

工厂角色
```
public class Factory {
	private static final Map<String,Product> prMap = new HashMap();
	
	public static synchronized Product createProduct(String type) throws Exception {
		Product product = null;
		
		//如果Map中已经有这个对象
		if(prMap.containsKey(type)) {
			product = prMap.get(type);
		} else {
			if(type.equals("Product1")) {
				product = new ConcreteProduct1();
			} else {
				product = new ConcreteProduct2();
			}
			//同时把对象放到缓存容器中
			prMap.put(type, product);
		}
		return product;
	}
}
```

**简单工厂模式的特点**
+ 统一由工厂进行实体的创建，便于管理
+ 不符合设计模式中：单一职责原则——一个工厂类管理多个产品实体的创建；开闭原则——每次业务新增都要修改代码

## 工厂方法模式(Factory Method)

和简单工厂模式中工厂负责生产所有产品相比，工厂方法模式将生成具体产品的任务分发给具体的产品工厂，其UML类图如下：

![](/assets/upload/2020-03/1584024898.png)

工厂方法模式涉及4个角色：
+ 抽象工厂角色（Factory）：提供抽象方法供具体工厂实现
+ 具体工厂角色（ConcreteFactory）：提供具体的工厂
+ 抽象产品角色（Product）：提供抽象方法供具体产品类实现
+ 具体产品角色（ConcreteProduct）：提供具体的产品

抽象产品角色
```
public abstract class Product {
	//产品类的公共方法
	public void method1(){
		//业务逻辑处理
	}
	//抽象方法1
	public abstract void method2();	
}

```

具体产品角色
```
public class ConcreteProduct1 extends Product {
	public void method2() {
		//业务逻辑处理
	}
}

public class ConcreteProduct2 extends Product {
	public void method2() {
		//业务逻辑处理
	}
}

```

抽象工厂角色
```
public abstract class Factory {
	/*
	 * 创建一个产品对象,其输入参数类型可以自行设置
	 * 通常为String、Enum、Class等，当然也可以为空
	 */
	public abstract <T extends Product> T createProduct(Class<T> c);
}

```

具体工厂角色
```
public class ConcreteFactory extends Factory {
	
	public <T extends Product> T createProduct(Class<T> c) {
		Product product = null;
		try {
			 product = (Product)Class.forName(c.getName()).newInstance();
		} catch (Exception e) {
			//异常处理
		}		
		return (T)product;		
	}
}
```

调用过程
```
public class Client {
	public static void main(String[] args) {
		Factory creator = new ConcreteFactory();
		Product product = creator.createProduct(ConcreteProduct1.class);
	}
}
```

### 工厂方法模式的优缺点

+ 优点：
	+ 工厂方法用来创建客户所需产品，同时还向客户隐藏了那种具体产品类将被实例化这一细节，用户只需关心所需产品对应的工厂，无需关心创建细节，甚至无需知道具体产品的类名
	+ 基于工厂角色和产品角色的多态性设计是工厂方法模式的关键，他能够让工厂自主确定创建何种产品对象，而如何创建这个对象的细节完全封装在具体工厂的内部，工厂方法模式之所以被称为多态工厂模式，正是因为所有的具体工厂都有同一抽象父类工厂
	+ 在系统中加入新产品时无需修改抽象工厂和抽象产品提供的接口，无需修改客户端，也无需修改其他具体过程和具体产品，而只要添加一个抽象工厂和抽象产品即可，这样系统的可扩展性将变得非常好，完全符合开闭原则
+ 缺点：
	+ 添加新产品时需要编写新的具体产品类还有对应的具体工厂类，系统中类的个数会增加，一定程度上增加了系统复杂度或额外开销
	+ 引入了抽象层，增加了系统的抽象性和理解难度
    

### JDK中的工厂方法模式
+ java.util.Collection接口中定义了一个抽象的iterator()方法，该方法就是一个工厂方法。对于iterator()方法来说Collection就是一个根抽象工厂，下面还有List等接口作为抽象工厂，再往下有ArrayList等具体工厂。java.util.Iterator接口是根抽象产品，下面有ListIterator等抽象产品，还有ArrayListIterator等作为具体产品。使用不同的具体工厂类中的iterator方法能得到不同的具体产品的实例。

![](/assets/upload/2020-03/collection-iterator-uml.png)

+ java.lang.Proxy#newProxyInstance()
+ java.lang.Object#toString()
+ java.lang.Class#newInstance()
+ java.lang.reflect.Array#newInstance()
+ java.lang.reflect.Constructor#newInstance()
+ java.lang.Boolean#valueOf(String)
+ java.lang.Class#forName()


## 抽象工厂模式(Abstract Factory)

抽象工厂模式是工厂方法模式的升级版本，在有多个业务品种、业务分类时，通过抽象工厂模式产生需要的对象是一种非常好的解决方式。

抽象工厂类
```
public abstract class AbstractCreator {
	//创建A产品家族
	public abstract AbstractProductA createProductA();
	
	//创建B产品家族
	public abstract AbstractProductB createProductB();
}

```

工厂实现类
```
public class Creator1 extends AbstractCreator {
	//只生产产品等级为1的A产品
	public AbstractProductA createProductA() {	
		return new ProductA1();
	}
	//只生产铲平等级为1的B产品
	public AbstractProductB createProductB() {
		return new ProductB1();
	}
}

public class Creator2 extends AbstractCreator {
	//只生产产品等级为2的A产品
	public AbstractProductA createProductA() {	
		return new ProductA2();
	}

	//只生产铲平等级为2的B产品
	public AbstractProductB createProductB() {
		return new ProductB2();
	}
}

```

抽象产品类
```
public abstract class AbstractProductA {
	//每个产品共有的方法
	public void shareMethod(){
		
	}
	//每个产品相同方法，不同实现
	public abstract void doSomething();
}

public abstract class AbstractProductB {
	//每个产品共有的方法
	public void shareMethod(){
		
	}
	//每个产品相同方法，不同实现
	public abstract void doSomething();
}

```

产品实现类
```
public class ProductA1 extends AbstractProductA {
	@Override
	public void doSomething() {
		System.out.println("产品A1的实现方法");
	}
}
public class ProductA2 extends AbstractProductA {
	@Override
	public void doSomething() {
		System.out.println("产品A2的实现方法");
	}
}

public class ProductB1 extends AbstractProductB {
	@Override
	public void doSomething() {
		System.out.println("产品B1的实现方法");
	}
}
public class ProductB2 extends AbstractProductB {
	@Override
	public void doSomething() {
		System.out.println("产品B2的实现方法");
	}
}

```

调用过程
```
public class Client {
	public static void main(String[] args) {
		//定义出两个工厂
		AbstractCreator creator1 = new Creator1();
		AbstractCreator creator2 = new Creator2();
		//产生A1对象
		AbstractProductA a1 = creator1.createProductA();
		//产生A2对象
		AbstractProductA a2 = creator2.createProductA();
		//产生B1对象
		AbstractProductB b1 = creator1.createProductB();
		//产生B2对象
		AbstractProductB b2 = creator2.createProductB();
	}
}
```

### 抽象工厂模式的优缺点
+ 优点：
	+ 隔离了具体类的生成，使得客户并不需要知道什么被创建，具有良好的封装性。
	+ 横向扩展容易，如果需要增加多个产品，只需要增加新的工厂类和产品类即可。
+ 缺点：
	+ 纵向扩展困难。如果增加新的产品，抽象工厂类也要添加创建该产品类的对应方法，这样一来所有的具体工厂类都要做修改了，严重违背了开闭原则。