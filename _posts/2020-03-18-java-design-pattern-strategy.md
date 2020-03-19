---
title: Java设计模式——策略模式
date: 2020-03-18
categories:
- tech
tags:
- java
- design pattern
---

策略模式（Strategy）定义一系列的算法，将每个算法都封装起来，并且使它们之间可以互换。

<!-- more -->

策略模式涉及到了3个角色：
+ 抽象策略角色（Strategy）：策略、算法的抽象，通常为接口，定义每个策略或算法必须具有的方法和属性。
+ 具体策略角色（ConcreteStrategy）：实现抽象策略中的操作，含有具体的算法。
+ 环境角色（Context）：起承上启下封装作用，屏蔽高层模块对策略、算法的直接访问，封装可能存在的变化。

类图结构如下：

![](/assets/upload/2020-03/1584495548.png)


## 策略模式的实现

抽象策略角色
```
public interface Strategy {
    //策略模式的运算法则
    void doSomething();
}
```

具体策略角色
```
public class ConcreteStrategy1 implements Strategy {
    public void doSomething() {
        System.out.println("具体策略1的运算法则");
    }
}

public class ConcreteStrategy2 implements Strategy {
    public void doSomething() {
        System.out.println("具体策略2的运算法则");
    }

}
```

环境角色
```
public class Context {
    //抽象策略
    private Strategy strategy = null;
    //构造函数设置具体策略
    public Context(Strategy _strategy){
        this.strategy = _strategy;
    }
    //封装后的策略方法
    public void doAnythinig(){
        this.strategy.doSomething();
    }
}
```

调用过程
```
public class Client {
    public static void main(String[] args) {
        //声明出一个具体的策略
        Strategy strategy = new ConcreteStrategy1(); 
        //声明出上下文对象
        Context context = new Context(strategy);
        //执行封装后的方法
        context.doAnythinig();
    }
}
```

## 策略模式的适用场景 

+ 在有多种算法相似的情况下，使用 `if...else` 所带来的复杂和难以维护

## 策略模式的优缺点
+ 优点：
    + 上下文和具体策略是松耦合关系。因此上下文只知道它要使用某一个实现`Strategy`接口类的实例，但不需要知道具体是哪一个类。
    + 策略模式满足“开-闭原则”。当增加新的具体策略时，不需要修改上下文类的代码，上下文就可以引用新的具体策略的实例。
+ 缺点：
    + 客户端必须知道所有的策略类，并自行决定使用哪一个策略类
    + 策略模式将造成产生很多策略类

## 策略工厂模式

在策略模式中，使用其中一个策略的时候，也需要通过每次都创建新的策略类来实现，会造成创建对象过多的情况，一般我们会把策略模式结合静态工厂模式一起使用，称作策略工厂模式。

其主要的升级就在于`Context`维护了所有的策略类，通过一个标识来判断具体使用哪一个策略类。

```
public class Context {

    //抽象策略集合
    private static Map<String, Strategy> STRATEGIES_CACHE = new ConcurrentHashMap<String, Strategy>();

    /**
     * 初始化策略列表的方式一，手动注册
     */
    public static void register(String type, Strategy strategy) {
        STRATEGIES_CACHE.put(type, strategy);
    }

    /**
     * 初始化策略列表的方式二，使用Spring的ApplicationContext，根据Class获取所有实现类，解析实现类的注解，实现自动注册。
     */
    @Autowired
    private ApplicationContext applicationContext;
    @PostConstruct
    private void init() {
        Map<String, Strategy> beansOfType = applicationContext.getBeansOfType(Strategy.class);
        beansOfType.entrySet().forEach(e -> {
            StrategyTypeAnnotation type = e.getValue().getClass().getDeclaredAnnotation(StrategyTypeAnnotation.class);
            STRATEGIES_CACHE.put(type.value(), e.getValue());
        });
    }

    //封装后的策略方法
    public void doAnythinig(String type) {
        Strategy strategy = STRATEGIES_CACHE.get(type);
        if (strategy != null) {
            strategy.doSomething();
        } else {
            throw new RuntimeException("Unexpected type " + type);
        }
    }
}

/**
 * 可以使用注解实现自动扫描策略类
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface StrategyTypeAnnotation {
	String value();
}
@StrategyTypeAnnotation(value = "strategy1")
public class ConcreteStrategy1 implements Strategy {
    public void doSomething() {
        System.out.println("具体策略1的运算法则");
    }
}
```

调用过程
```
public class Client {
    public static void main(String[] args) {
        //这里我们也可以通过扫描注解的方式自动注册
        Strategy strategy1 = new ConcreteStrategy1(); 
        Strategy strategy2 = new ConcreteStrategy2();
        //策略标识可以用枚举类代替
        Context.register("strategy1", strategy1);
        Context.register("strategy2", strategy2);
        //执行封装后的方法
        Context context = new Context();
        context.doAnythinig("strategy1");
    }
}
```

策略工厂可以防止程序运行过程中重复创建大量的策略类，提升运行效率。
