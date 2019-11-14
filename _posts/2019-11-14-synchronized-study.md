---
title: Synchronized的使用及实现原理
date: 2019-11-14
categories:
- tech
tags:
- java
---

Synchronized 关键字常用来解决线程安全问题。在Synchronized优化以前被当做重量级锁使用。重量级锁是依赖对象内部的monitor锁来实现的，而monitor又依赖操作系统的MutexLock(互斥锁)来实现的，所以重量级锁也被成为互斥锁。但是自从Synchronized引入了偏向锁，轻量级锁（自旋锁）后，性能甚至与ReentrantLock差不多了，在两种方法都可用的情况下，官方甚至建议使用Synchronized。

<!-- more -->

## Synchronized介绍
在谈论synchronized之前，我们需要了解线程安全问题的主要诱因：
+ 存在共享数据（也称为临界资源）
+ 存在多条线程共同操作这些共享数据
而解决线程安全的根本方法就是：同一时刻有且只有一个线程在操作共享数据，其他线程必须等到该线程处理完数据后再对共享数据进行操作。

基于上述，引入了互斥锁，其具有两个特性：

+ 互斥性：即在同一时间只允许一个线程持有某个对象锁，通过这种特性来实现多线程的协调机制，这样在同一时间只有一个线程对需要同步的代码块进行访问。互斥性也称作操作的原子性。
+ 可见性：必须确保在锁被释放之前，对共享变量所做的修改，对于随后获得该锁的另一个线程是可见的（即在获得锁时应获得最新共享变量的值），否则另一个线程可能是在本地缓存的某个副本上继续操作，从而引起不一致。


## Synchronized实现方式
Synchronized有以下三种使用方式：

+ 同步普通方法（synchronized method），锁的是当前实例对象。
+ 同步静态方法（synchronized static method），锁的是当前 Class 对象。
+ 同步块（synchronized()），锁的是 () 中的对象，() 中可以是实例对象，也可以是 Class对象。

以上方式获取锁的分类，可分为获取对象锁、获取类锁，他们将产生不同的互斥效果：
1. 类可以有多个实例对象，所以多个对象锁互不干扰，若锁住的是同一个对象，则同时只能有一个线程访问对象的同步方法或同步代码块时，其他访问同步方法或同步代码块的线程会被阻塞
2. 若锁住的是同一个类，由于类只有一个，相当于所有线程都在共用一把锁，
3. 类锁和对象锁互不干扰。

## Synchronized实现原理

实现原理：JVM 是通过进入、退出对象监视器( Monitor )来实现对方法、同步块的同步的。

具体实现是在编译之后在同步方法调用前加入一个 monitor.enter 指令，在退出方法和异常处插入 monitor.exit 的指令。

其本质就是对一个对象监视器( Monitor )进行获取，而这个获取过程具有排他性从而达到了同一时刻只能一个线程访问的目的。

而对于没有获取到锁的线程将会阻塞到方法入口处，直到获取锁的线程 monitor.exit 之后才能尝试继续获取锁。

流程图如下：

![]({{site.upload | relative_url}}/2019-11-14/5d313f638492c49210.jpg)


通过一段代码来演示:
```
public static void main(String[] args) {
    synchronized (Synchronize.class){
        System.out.println("Synchronize");
    }
}
```

使用 javap -c Synchronize 可以查看编译之后的具体信息。

```
public class com.crossoverjie.synchronize.Synchronize {
  public com.crossoverjie.synchronize.Synchronize();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: ldc           #2                  // class com/crossoverjie/synchronize/Synchronize
       2: dup
       3: astore_1
       **4: monitorenter**
       5: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
       8: ldc           #4                  // String Synchronize
      10: invokevirtual #5                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      13: aload_1
      **14: monitorexit**
      15: goto          23
      18: astore_2
      19: aload_1
      20: monitorexit
      21: aload_2
      22: athrow
      23: return
    Exception table:
       from    to  target type
           5    15    18   any
          18    21    18   any
}
```
可以看到在同步块的入口和出口分别有 monitorenter,monitorexit 指令。

## 锁优化

synchronized 很多都称之为重量锁，JDK1.6 中对 synchronized 进行了各种优化，为了能减少获取和释放锁带来的消耗引入了偏向锁和轻量锁。

### 偏向锁

为了进一步的降低获取锁的代价，`JDK1.6` 之后还引入了偏向锁。

偏向锁的特征是:锁不存在多线程竞争，并且应由一个线程多次获得锁。

当线程访问同步块时，会使用 `CAS` 将线程 ID 更新到锁对象的 `Mark Word` 中，如果更新成功则获得偏向锁，并且之后每次进入这个对象锁相关的同步块时都不需要再次获取锁了。

### 释放锁
当有另外一个线程获取这个锁时，持有偏向锁的线程就会释放锁，释放时会等待全局安全点(这一时刻没有字节码运行)，接着会暂停拥有偏向锁的线程，根据锁对象目前是否被锁来判定将对象头中的 `Mark Word` 设置为无锁或者是轻量锁状态。

偏向锁可以提高带有同步却没有竞争的程序性能，但如果程序中大多数锁都存在竞争时，那偏向锁就起不到太大作用。可以使用 `-XX:-UseBiasedLocking` 来关闭偏向锁，并默认进入轻量锁。

### 轻量锁

当代码进入同步块时，如果同步对象为无锁状态时，当前线程会在栈帧中创建一个锁记录(`Lock Record`)区域，同时将锁对象的对象头中 `Mark Word` 拷贝到锁记录中，再尝试使用 `CAS` 将 `Mark Word` 更新为指向锁记录的指针。

如果更新**成功**，当前线程就获得了锁。

如果更新**失败** `JVM` 会先检查锁对象的 `Mark Word` 是否指向当前线程的锁记录。

如果是则说明当前线程拥有锁对象的锁，可以直接进入同步块。

不是则说明有其他线程抢占了锁，如果存在多个线程同时竞争一把锁，**轻量锁就会膨胀为重量锁**。

### 解锁
轻量锁的解锁过程也是利用 `CAS` 来实现的，会尝试锁记录替换回锁对象的 `Mark Word` 。如果替换成功则说明整个同步操作完成，失败则说明有其他线程尝试获取锁，这时就会唤醒被挂起的线程(此时已经膨胀为`重量锁`)

轻量锁能提升性能的原因是：

认为大多数锁在整个同步周期都不存在竞争，所以使用 `CAS` 比使用互斥开销更少。但如果锁竞争激烈，轻量锁就不但有互斥的开销，还有 `CAS` 的开销，甚至比重量锁更慢。

### 适应性自旋

在使用 `CAS` 时，如果操作失败，`CAS` 会自旋再次尝试。由于自旋是需要消耗 `CPU` 资源的，所以如果长期自旋就白白浪费了 `CPU`。`JDK1.6`加入了适应性自旋:

> 如果某个锁自旋很少成功获得，那么下一次就会减少自旋。

## Synchronized和ReentrantLock的区别

1. synchronized是关键字，ReentrantLock是类；
2. ReentrantLock可以获取锁的时间进行设置，避免死锁；
3. ReentrantLock可以获取各种锁的信息；
4. ReentrantLock可以灵活实现多路通知；
5. 机制：sync操作Mark Word，lock调用Unsafe类的park（）方法。
6. 能够实现比synchronized更细粒度的控制，比如控制公平性


## 参考
[Synchronized与ReentrantLock区别总结（简单粗暴，一目了然）](https://blog.csdn.net/zxd8080666/article/details/83214089
)
[Synchronized的基本知识、实现原理以及其与ReentrantLock的区别](https://www.cnblogs.com/jlutiger/p/10548291.html)

[synchronized 关键字原理](https://crossoverjie.top/JCSprout/#/thread/Synchronize)