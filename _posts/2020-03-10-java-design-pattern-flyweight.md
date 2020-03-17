---
title: Java设计模式——享元模式
date: 2020-03-10
categories:
- tech
tags:
- java
- design pattern
---

享元模式是一种结构型设计模式。享元即为分享元素，字符串常量池、数据库连接池、缓冲池都是这个道理。该模式的意图为：运用共享技术有效地支持大量细粒度的对象。

<!-- more -->

由于享元模式区分了内部状态和外部状态，所以我们可以通过设置不同的外部状态使得相同的对象可以具备一些不同的特性，而内部状态设置为相同部分。在我们的程序设计过程中，我们可能会需要大量的细粒度对象来表示对象，如果这些对象除了几个参数不同外其他部分都相同，这个时候我们就可以利用享元模式来大大减少应用程序当中的对象。

+ 内部状态：在享元对象内部不随外界环境改变而改变的共享部分。
+ 外部状态：随着环境的改变而改变，不能够共享的状态就是外部状态。

享元模式涉及3个角色：
+ 抽象享元(Flyweight)角色 ：父接口，以规定出所有具体享元角色需要实现的方法。
+ 具体享元(ConcreteFlyweight)角色：实现抽象享元角色所规定出的接口。
+ 享元工厂(FlyweightFactory)角色 ：本角色负责创建和管理享元角色。本角色必须保证享元对象可以被系统适当地共享。当一个客户端对象调用一个享元对象的时候，享元工厂角色会检查系统中是否已经有一个符合要求的享元对象。如果已经有了，享元工厂角色就应当提供这个已有的享元对象；如果系统中没有一个适当的享元对象的话，享元工厂角色就应当创建一个合适的享元对象。

类图结构如下：

![](/assets/upload/2020-03/1583800108.png)

## 享元模式的实现

抽象享元角色，注意划分外部状态和内部状态，否则可能会引起线程安全问题。
```
public abstract class Flyweight {
    //内部状态
    private String intrinsic;
    //外部状态
    protected final String extrinsic;
    //要求享元角色必须接受外部状态
    public Flyweight(String _extrinsic) {
        this.extrinsic = _extrinsic;
    }
    
    //定义业务操作
    public abstract void operate();
    
    //内部状态的getter/setter
    public String getIntrinsic() {
        return intrinsic;
    }
    public void setIntrinsic(String intrinsic) {
        this.intrinsic = intrinsic;
    }    

}

```

具体享元角色
```
public class ConcreteFlyweight1 extends Flyweight {
    //接受外部状态
    public ConcreteFlyweight1(String _extrinsic){
        super(_extrinsic);
    }
    
    //根据外部状态进行逻辑处理
    public void operate(){
        //业务逻辑
    }
}
public class ConcreteFlyweight2 extends Flyweight {
    //接受外部状态
    public ConcreteFlyweight2(String _extrinsic) {
        super(_extrinsic);
    }
    
    //根据外部状态进行逻辑处理
    public void operate() {
        //业务逻辑
    }
}

```


享元工厂角色，这些类必须有一个工厂对象加以控制
```
public class FlyweightFactory {
    //定义一个池容器
    private static HashMap<String, Flyweight> pool= new HashMap<String, Flyweight>();
    
    //享元工厂
    public static Flyweight getFlyweight(String extrinsic) {
        //需要返回的对象
        Flyweight flyweight = null;
        //在池中没有改对象
        if(pool.containsKey(extrinsic)) {
            flyweight = pool.get(extrinsic);
        } else {
            //根据外部状态创建享元对象
            flyweight = new ConcreteFlyweight1(extrinsic);
            //放置到池中
            pool.put(extrinsic, flyweight);
        }
        return flyweight;
    }
}
```

## 享元模式的优缺点

+ 优点：
	+ 大大减少对象的创建，降低系统的内存，使效率提高。
	 
+ 缺点：
	+ 提高了系统的复杂度，需要分离出外部状态和内部状态，而且外部状态具有固有化的性质，不应该随着内部状态的变化而变化，否则会造成系统的混乱。

## 享元模式的使用场景
+ 系统中存在大量的相似对象。 
+ 对象的大多数状态都可变为外部状态。 
+ 如果删除对象的外部状态，那么可以用相对较少的共享对象取代很多组对象。
+ 需要缓冲池的场景

## 享元模式的应用实例

+ Integer类，在[-128, 127]大小范围内将直接返回相同的对象，使用直接赋值的自动装箱操作，也是调用valueOf方法。
```
public static Integer valueOf(int i) {
    //IntegerCache.low = -128
    //IntegerCache.high = 127
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```
+ JAVA 中的 String，如果有则返回，如果没有则创建一个字符串保存在字符串缓存池里面。
+ 数据库的连接池。
