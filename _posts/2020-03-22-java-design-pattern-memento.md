---
title: Java设计模式——备忘录模式
date: 2020-03-22
categories:
- tech
tags:
- java
- design pattern
---

备忘录模式（Memento），也是行为模式的一种。在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，这样以后就可以将该对象恢复到原先保存的状态。简单的来说就是平时玩的通关游戏，打完一关后保存进度，后面如果挂了，就可以回到上一个保存的进度。

<!-- more -->

备忘录模式中涉及到了如下几种角色：
+ Originator(发起人角色)：负责创建一个备忘录Memento，用以记录当前时刻自身的内部状态，并可使用备忘录恢复内部状态。Originator可以根据需要决定Memento存储自己的哪些内部状态。
+ Memento(备忘录角色)：负责存储Originator发起人对象的内部状态，在需要的时候提供发起人所需要的内部状态。
+ Caretaker(备忘录管理者角色)：负责管理备忘录Memento，不能对Memento的内容进行访问或者操作。

备忘录模式就是一个对象的备份模式，提供了一种程序数据的备份方法，它的类图结构如下：

![](/assets/upload/2020-03/1584872588.png)


## 备忘录模式的实现

备忘录
```
public class Memento {
    //发起人的内部状态
    private String state = "";
    
    //构造函数传递参数
    public Memento(String _state){
        this.state = _state;
    }
    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
```

备忘录管理者
```
public class Caretaker {
    //容纳备忘录的容器
    private HashMap<String, Memento> memMap = new HashMap<String, Memento>();

    public Memento getMemento(String idx) {
        return memMap.get(idx);
    }

    public void setMemento(String idx,Memento memento) {
        this.memMap.put(idx, memento);
    }
    
}
```

发起人
```
public class Originator {
    //内部状态
    private String state = "";
    
    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    //创建一个备忘录
    public Memento createMemento(){
        return new Memento(this.state);
    }
    
    //恢复一个备忘录
    public void restoreMemento(Memento _memento){
        this.setState(_memento.getState());
    }
}
```

调用过程
```
public class Client {
    public static void main(String[] args) {
        //定义出发起人
        Originator originator = new Originator();
        //定义出备忘录管理员
        Caretaker caretaker = new Caretaker();
        //创建两个备忘录
        caretaker.setMemento("001",originator.createMemento());
        caretaker.setMemento("002",originator.createMemento());
        //恢复一个指定标记的备忘录
        originator.restoreMemento(caretaker.getMemento("001"));
    }
}
```

## 备忘录模式的适用场景 

+ 保存一个对象在某一个时刻的全部状态或部分状态，这样以后需要时它能够恢复到先前的状态，实现撤销操作。
+ 防止外界对象破坏一个对象历史状态的封装性，避免将对象历史状态的实现细节暴露给外界对象。

## 备忘录模式的优缺点

+ 优点：
    + 它提供了一种状态恢复的实现机制，使得用户可以方便地回到一个特定的历史步骤，当新的状态无效或者存在问题时，可以使用暂时存储起来的备忘录将状态复原。
    + 备忘录实现了对信息的封装，一个备忘录对象是一种原发器对象状态的表示，不会被其他代码所改动。备忘录保存了原发器的状态，采用列表、堆栈等集合来存储备忘录对象可以实现多次撤销操作。
+ 缺点：
    + 资源消耗过大，如果需要保存的原发器类的成员变量太多，就不可避免需要占用大量的存储空间，每保存一次对象的状态都需要消耗一定的系统资源。