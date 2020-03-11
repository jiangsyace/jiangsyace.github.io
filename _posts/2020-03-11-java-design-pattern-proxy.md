---
title: Java设计模式——代理模式
date: 2020-03-11
categories:
- tech
tags:
- java
- design pattern
---

代理模式是一种结构型设计模式。代理模式给某一个对象提供一个代理对象，并由代理对象控制对原对象的引用。

<!-- more -->

代理模式涉及3个角色：
+ 抽象角色(Subject)：通过接口或抽象类声明真实角色实现的业务方法。
+ 真实角色(RealSubject)：实现抽象角色，定义真实角色所要实现的业务逻辑，供代理角色调用
+ 代理角色(Proxy)：实现抽象角色，是真实角色的代理，通过真实角色的业务逻辑方法来实现抽象方法，并可以附加自己的操作

代理模式又分静态代理和动态代理。

## 静态代理

静态代理在程序运行之前，代理类`.class`文件就已经被创建，代理类和委托类的关系在运行前就确定。

类图结构如下：

![](/assets/upload/2020-03/1583928977.png)

抽象角色
```
public interface Subject {
    /**
     * 接口方法
     */
    public void request();
}
```

真实角色
```
public class ConcreteSubject implements Subject {
    /**
     * 具体的业务逻辑实现
     */
    @Override
    public void request() {
        //业务处理逻辑
    }
}
```

代理角色
```
public class Proxy implements Subject {

    /**
     * 要代理的实现类
     */
    private Subject subject = null;

    /**
     * 默认代理自己
     */
    public Proxy() {
        this.subject = new Proxy();
    }

    public Proxy(Subject subject) {
        this.subject = subject;
    }

    /**
     * 构造函数，传递委托者
     *
     * @param objects 委托者
     */
    public Proxy(Object... objects) {
    }

    /**
     * 实现接口方法
     */
    @Override
    public void request() {
        this.before();
        this.subject.request();
        this.after();
    }

    /**
     * 预处理
     */
    private void before() {
        //do something
    }

    /**
     * 后处理
     */
    private void after() {
        //do something
    }
}
```

调用过程
```
public class Client {
    public static void main(String[] args) {
        Subject subject = new ConcreteSubject();
        Proxy proxy = new Proxy(subject);
        proxy.request();
    }
}

```

静态代理优缺点
+ 优点
	+ 业务类只需要关注业务逻辑本身，保证了业务类的重用性。
	+ 代理使客户端不需要知道类的实现过程，而只需访问代理即可，实现解耦合。
+ 缺点 
	+ 代理类和真实类实现了相同的接口，如果接口增加一个方法，所有实现类和代理类都要实现此方法，这增加了代码维护的复杂度。
	+ 代理对象只服务于一种类型的对象，如果要服务多类型的对象，就需要为每一种对象都进行代理，可能产生大量的类对象。

由于静态代理的这个缺点，就需要使用动态代理。

## 动态代理

动态代理类的源码是在程序运行期间由JVM根据反射等机制动态的生成，所以不存在代理类的字节码文件。代理类和委托类的关系是在程序运行时确定。

抽象角色
```
public interface Subject {
    /**
     * 接口方法
     */
    void request();
}
```

真实角色
```
public class ConcreteSubject implements Subject {
    /**
     * 具体的业务逻辑实现
     */
    @Override
    public void request() {
        //业务处理逻辑
    }
}
```

动态代理角色，只能代理接口（不支持抽象类），代理类都需要实现`InvocationHandler`类，实现`invoke`方法。`invoke`方法就是调用被代理接口的所有方法时需要调用的，返回的值是被代理接口的一个实现类。
```
public class ProxyHandler implements InvocationHandler {
    /**
     * 目标对象
     */
    private Object target;

    /**
     * 绑定关系，也就是关联到哪个接口（与具体的实现类绑定）的哪些方法将被调用时，执行invoke方法。
     * @param target 绑定具体的代理实例
     * @return 动态代理类实例
     */
    public Object newProxyInstance(Object target) {
        this.target = target;
        /*
        该方法用于为指定类装载器、一组接口及调用处理器生成动态代理类实例。
        第一个参数指定产生代理对象的类加载器，需要将其指定为和目标对象同一个类加载器。
        第二个参数要实现和目标对象一样的接口，所以只需要拿到目标对象的实现接口。
        第三个参数表明这些被拦截的方法在被拦截时需要执行哪个InvocationHandler的invoke方法
        根据传入的目标返回一个代理对象
        */
        Object result = Proxy.newProxyInstance(target.getClass().getClassLoader(),
                target.getClass().getInterfaces(), this);
        return result;
    }

    /**
     * 关联的这个实现类的方法被调用时将被执行。InvocationHandler接口的方法。
     * @param proxy  代理
     * @param method 原对象被调用的方法
     * @param args   方法的参数
     * @return
     * @throws Throwable
     */
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) {
        System.out.println("预处理逻辑");
        Object ret = null;
        try {
            //调用目标方法
            ret = method.invoke(target, args);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("后处理逻辑");
        return ret;
    }
}
```
被代理对象target通过参数传递进来，我们通过`target.getClass().getClassLoader()`获取`ClassLoader`对象，然后通过`target.getClass().getInterfaces()`获取它实现的所有接口，然后将`target`包装到实现了`InvocationHandler`接口的`ProxyHandler`实现对象中。通过`newProxyInstance`函数我们就获得了一个动态代理对象。


调用过程
```
public class Client {
    public static void main(String[] args) {
        ProxyHandler handler = new ProxyHandler();
        Subject subject = (Subject) handler.newProxyInstance(new ConcreteSubject());
        subject.request();
    }
}
```

动态代理的优缺点
+ 优点
	+ 与静态代理相比较，最大的好处是接口中声明的所有方法都被转移到调用处理器的`invoke`方法中处理，使我们的类职责更加单一，复用性更强。
+ 缺点
	+ 目标对象一定要实现接口，否则不能使用动态代理。动态生成的代理类的继承关系图，已经注定有一个共同的父类叫`Proxy`。Java 的单继承机制注定了这些动态代理类无法实现对`Class`的动态代理。

## 代理模式的应用实例
+ Spring AOP
+ Java使用RMI实现远程代理
+ web service
