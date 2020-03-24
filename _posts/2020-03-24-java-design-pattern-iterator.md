---
title: Java设计模式——迭代器模式
date: 2020-03-24
categories:
- tech
tags:
- java
- design pattern
---


迭代器模式（Iterator）提供一种方法来访问聚合对象，而不用暴露这个对象的内部表示，其别名为游标（Cursor）。

<!-- more -->

迭代器模式中涉及到了如下几种角色：
+ 抽象迭代器（Iterator）：它定义了访问和遍历元素的接口，声明了用于遍历数据元素的方法，例如：用于获取第一个元素的 first() 方法，用于访问下一个元素的 next() 方法，用于判断是否还有下一个元素的 hasNext() 方法，用于获取当前元素的 currentItem() 方法等，在具体迭代器中将实现这些方法。 
+ 具体迭代器（ConcreteIterator）：它实现了抽象迭代器接口，完成对聚合对象的遍历，同时在具体迭代器中通过游标来记录在聚合对象中所处的当前位置，在具体实现时，游标通常是一个表示位置的非负整数。 
+ 抽象聚合类（Aggregate）：它用于存储和管理元素对象，声明一个 createIterator() 方法用于创建一个迭代器对象，充当抽象迭代器工厂角色。 
+ 具体聚合类（ConcreteAggregate）：它实现了在抽象聚合类中声明的 createIterator() 方法，该方法返回一个与该具体聚合类对应的具体迭代器 ConcreteIterator 实例。 

它的类图结构如下：

![](/assets/upload/2020-03/1585016423.png)

## 迭代器模式的实现

抽象迭代器
```
public interface Iterator {
    //遍历到下一个元素
    Object next();
    
    //是否已经遍历到尾部
    boolean hasNext();
    
    //删除当前指向的元素
    boolean remove();
}
```

具体迭代器
```
public class ConcreteIterator implements Iterator {
    private Vector vector = new Vector();
    //定义当前游标
    public int cursor = 0;
    
    @SuppressWarnings("unchecked")
    public ConcreteIterator(Vector _vector) {
        this.vector = _vector;
    }
    
    //判断是否到达尾部
    public boolean hasNext() {
        if (this.cursor == this.vector.size()) {
            return false;
        } else {
            return true;
        }
    }
    
    //返回下一个元素
    public Object next() {
        Object result = null;
        
        if (this.hasNext()) {
            result = this.vector.get(this.cursor++);
        } else {
            result = null;
        }
        return result;
    }

    //删除当前元素
    public boolean remove() {
        this.vector.remove(this.cursor);
        return true;
    }
}
```

抽象聚合类
```
public interface Aggregate {
    //是容器必然有元素的增加
    void add(Object object);
    
    //减少元素
    void remove(Object object);
    
    //由迭代器来遍历所有的元素
    Iterator iterator();
}
```

具体聚合类
```
public class ConcreteAggregate implements Aggregate {
    //容纳对象的容器
    private Vector vector = new Vector();
    
    //增加一个元素
    public void add(Object object) {
        this.vector.add(object);
    }

    //返回迭代器对象
    public Iterator iterator() {
        return new ConcreteIterator(this.vector);
    }

    //删除一个元素
    public void remove(Object object) {
        this.remove(object);
    }
}
```

调用过程
```
public class Client {
    public static void main(String[] args) {
        //声明出容器
        Aggregate agg = new ConcreteAggregate();
        
        //产生对象数据放进去
        agg.add("abc");
        agg.add("aaa");
        agg.add("1234");
        
        //遍历一下
        Iterator iterator = agg.iterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }
    }
}

```

## 迭代器模式的适用场景 

+ 访问一个聚合对象的内容而无须暴露它的内部表示。将聚合对象的访问与内部数据的存储分离，使得访问聚合对象时无须了解其内部实现细节。 
+ 需要为一个聚合对象提供多种遍历方式。 
+ 为遍历不同的聚合结构提供一个统一的接口，在该接口的实现类中为不同的聚合结构提供不同的遍历方式，而客户端可以一致性地操作该接口。 
+ JDK中几乎所有的集合对象都拥有迭代器。

## 迭代器模式的优缺点

+ 优点：
	+ 它支持以不同的方式遍历一个聚合对象，在同一个聚合对象上可以定义多种遍历方式。在迭代器模式中只需要用一个不同的迭代器来替换原有迭代器即可改变遍历算法，我们也可以自己定义迭代器的子类以支持新的遍历方式。 
	+ 迭代器简化了聚合类。由于引入了迭代器，在原有的聚合对象中不需要再自行提供数据遍历等方法，这样可以简化聚合类的设计。 
	+ 在迭代器模式中，由于引入了抽象层，增加新的聚合类和迭代器类都很方便，无须修改原有代码，满足“开闭原则”的要求。

+ 缺点：
	+ 由于迭代器模式将存储数据和遍历数据的职责分离，增加新的聚合类需要对应增加新的迭代器类，类的个数成对增加，这在一定程度上增加了系统的复杂性。 
	+ 抽象迭代器的设计难度较大，需要充分考虑到系统将来的扩展，例如 JDK 内置迭代器 Iterator 就无法实现逆向遍历，如果需要实现逆向遍历，只能通过其子类 ListIterator 等来实现，而 ListIterator 迭代器无法用于操作 Set 类型的聚合对象。在自定义迭代器时，创建一个考虑全面的抽象迭代器并不是件很容易的事情。 
