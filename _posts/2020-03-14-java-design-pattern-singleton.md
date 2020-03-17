---
title: Java设计模式——单例模式
date: 2020-03-14
categories:
- tech
tags:
- java
- design pattern
---

单例模式（Singleton）是一种很常见的创建型模式。它的定义是：保证一个类只有一个实例，并提供全局访问点。

<!-- more -->

## 单例模式的实现

单例模式有多种实现方式，但是他们都需要达到同样的目的。
+ 将构造方法私有化，使其不能在类的外部通过new关键字实例化该类对象。
+ 在该类内部产生一个唯一的实例化对象，并且将其封装为`private static`类型。
+ 定义一个静态方法返回这个唯一对象。

### 懒汉模式
```
/**
 * 懒汉模式（延迟加载，非线程安全）
 */
public class LazySingleton {
    private static LazySingleton lazySingleton = null;
    private LazySingleton() {}
    public static LazySingleton getInstance() {
        if (lazySingleton == null) {
             lazySingleton = new LazySingleton();
        }
        return lazySingleton;
     }
}
```
### 饿汉模式

利用了类加载的初始化单例，即借助了ClassLoader的线程安全机制，ClassLoader的loadClass方法在加载类的时候使用了synchronized关键字来实现线程安全。
```
/**
 * 饿汉模式（预加载，线程安全）
 */
public class HungrySingleton implements Serializable {

        private final static HungrySingleton hungrySingleton = new HungrySingleton();

        private HungrySingleton() {
            //防止反射生成新实例
            if(hungrySingleton != null){
            throw new RuntimeException("单例模式禁止反射调用！");
        }
        }

        public static HungrySingleton getInstance() {
            return hungrySingleton;
        }

        //防止反序列化生成新实例
        private Object readResolve(){
        return serializableSingleton;
    }
}
```

### 静态内部类

这种方式跟饿汉式方式采用的机制类似，但又有不同。两者都是采用了类装载的机制来保证初始化实例时只有一个线程，不同的地方在饿汉式方式是只要Singleton类被装载就会实例化，没有Lazy-Loading的作用，而静态内部类方式在调用getInstance方法时，才会装载SingletonInstance类，从而完成Singleton的实例化。

```
/**
 * 静态内部类
 */
public class StaticInnerClassSingleton {
    private StaticInnerClassSingleton() {}

    private static class InnerClass {
        private static StaticInnerClassSingleton instance = new StaticInnerClassSingleton();
    }

    public static StaticInnerClassSingleton getInstance(){
        return InnerClass.instance;
    }
}
```
### DCL双检查锁机制（Double Checked Locking）

```
/**
 * 双重校验加锁（延迟加载，线程安全）
 */
public class LazyDoubleCheckSingleton {

    //由于会发生重排序的情况，所以使用volatile保证创建LazyDoubleCheckSingleton实例不会发生重排序。
    private volatile static LazyDoubleCheckSingleton lazyDoubleCheckSingleton = null;
    private LazyDoubleCheckSingleton() {}

    public static LazyDoubleCheckSingleton getInstance() {
        if (lazyDoubleCheckSingleton == null) {
            synchronized (LazyDoubleCheckSingleton.class){
                if(lazyDoubleCheckSingleton == null){
                    lazyDoubleCheckSingleton = new LazyDoubleCheckSingleton();
                }
            }
        }
        return lazyDoubleCheckSingleton;
    }
}
```

### 无阻塞实现

基于Cas的乐观锁模式实现的单例模式，它的好处在于不需要使用传统的锁机制来保证线程安全，CAS是一种基于忙等待的算法，依赖底层硬件同步原语来实现，相对于锁它没有线程切换和阻塞的额外消耗，可以支持较大的并行度。
CAS的一个重要缺点在于如果忙等待一直执行不成功(一直在死循环中)，会对CPU造成较大的执行开销。
另外，如果N个线程同时执行到`singleton = new Singleton();`的时候，会有大量对象创建，很可能导致内存溢出。
虽然不推荐这种方式实现单例模式，但也可以更加了解CAS的实现和运用。

```
/**
 * 基于Cas的乐观锁模式实现
 */
public class CasSingleton {
    private static final AtomicReference<CasSingleton> INSTANCE = new AtomicReference();
    private CasSingleton() {}
    public static final CasSingleton getInstance(){
        while(true){
            CasSingleton casClass = INSTANCE.get();
            if (casClass != null) {
                return casClass;
            }
            casClass = new CasSingleton();
            if (INSTANCE.compareAndSet(null, casClass)) {
                return casClass;
            }
        }
    }
}

```

### 枚举类

```
/**
 * 基于枚举类的实现
 */
public enum EnumSingleton {
    INSTANCE;
    private EnumSingleton() {}

    public static EnumSingleton getInstance() {
        return INSTANCE;
    }
}
```

枚举类是比较推荐的实现单例模式的方法，因为枚举类的特性就保证了单例的实现，防止对单例的破坏。
+ 序列化后再反序列化单例对象，会反射一个新对象，破坏单例的可靠性，而jdk的枚举类源码上就避免了这个错误。
+ 枚举类没有无参构造器，并且jdk也禁止使用反射创建枚举对象。

```
/**
 * 测试枚举类单例的可靠性
 */
public class Test {
    public static void main(String[] args) throws IOException, ClassNotFoundException {

        EnumSingleton instance = EnumSingleton.getInstance();

        Class reflectClass = EnumSingleton.class;

        //例子1：测试序列化、反序列化是否能破坏枚举单例模式
        String fileName = "SingletonTest";
        //写文件
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(fileName));
        oos.writeObject(instance);
        File file = new File(fileName);
        //读文件
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file));
        EnumSingleton newInstance = (EnumSingleton) ois.readObject();
        System.out.println(instance == newInstance);

        //例子2：通过反射调用EnumSingleton无参构造器,测试是否能破坏枚举单例模式
        Constructor constructor = null;
        try {
            constructor = reflectClass.getDeclaredConstructor();
            constructor.setAccessible(true);
            EnumSingleton newInstance2 = (EnumSingleton) constructor.newInstance();
            System.out.println(instance == newInstance2);
        } catch (Exception e) {
            e.printStackTrace();
        }

        //例子3：通过反射调用EnumSingleton有参构造器,测试是否能破坏枚举单例模式
        Constructor constructor2 = null;
        try {
            constructor2 = reflectClass.getDeclaredConstructor(String.class, int.class);
            constructor2.setAccessible(true);
            EnumSingleton newInstance3 = (EnumSingleton) constructor2.newInstance("MuggleLee", 22);
            System.out.println(instance == newInstance3);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```
## 单例模式的使用场景
+ 工具类
+ 常量类
+ 连接池
+ 线程池

## 单例模式的优缺点
+ 优点
	+ 单例模式存在一个全局访问点，所以优化共享资源；
    + 只生成一个实例，减少了开销，对于一些需要频繁创建和销毁的对象，单例模式可以提高系统性能
+ 缺点
    + 由于单例模式中没有抽象层，因此扩展困难；
    + 职责过重，在一定程度上违背了“单一职责原则”。
