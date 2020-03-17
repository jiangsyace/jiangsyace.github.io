---
title: Java设计模式——组合模式
date: 2020-03-07
categories:
- tech
tags:
- java
- design pattern
---

组合模式是一种结构型设计模式。组合模式的思想是：将对象组合成树形结构以表示“部分－整体”的层次结构，使得用户对单个对象和组合对象的使用具有一致性。

<!-- more -->

如果我们需要使用对象树来描述或实现的功能，都可以考虑使用组合模式，比如读取XML文件，树形菜单和文件夹的管理等。

组合模式涉及3个角色：

+ Component（抽象构件）：它可以是接口或抽象类，定义参加组合对象的共有方法和属性。
+ Leaf（叶子构件）：叶子节点没有子节点，它实现了在抽象构件中定义的行为。
+ Composite（树枝构件）：它的作用是组合树枝节点和野子节点形成一个树形结构。

组合模式包括2种形式：透明组合模式、安全组合模式。

## 透明组合模式

透明组合模式就是把用来组合使用的方法放到抽象类中，比如add、remove等方法，这样的好处是，叶子与树枝提供的方法是一致的，客户端可以相同的对待所有的类。

结构图如下：

![](/assets/upload/2020-03/1583546346.png)

透明组合模式的缺点：不安全，因为叶子和树枝在本质上是有区别的。叶子不可能有下一个层次的对象，不可能包含成员，因此为其提供add()、remove()等方法是没有意义的，如果没有提供相应的错误处理代码，虽然在编译阶段不会出错，但在运行阶段调用这些方法就会出错。

代码实现：

抽象构件定义了叶子与树枝构件共有的方法
```
public abstract class Component {
    //个体和整体都具有的共享
    public void doSomething(){
        //编写业务逻辑
    }    
    //增加一个叶子构件或树枝构件
    public abstract void add(Component component);
    
    //删除一个叶子构件或树枝构件
    public abstract void remove(Component component);
    
    //获得分支下的所有叶子构件和树枝构件
    public abstract ArrayList<Component> getChildren();
}

```
叶子节点可以选择使用抽象构件的方法，也可以重写。
```
public class Leaf extends Component {    
    @Deprecated
    public void add(Component component) throws UnsupportedOperationException{
        //空实现,直接抛弃一个“不支持请求”异常
        throw new UnsupportedOperationException();
    }
    
    @Deprecated
    public void remove(Component component)throws UnsupportedOperationException{
        //空实现
        throw new UnsupportedOperationException();
    }
    
    @Deprecated
    public ArrayList<Component> getChildren()throws UnsupportedOperationException{
        //空实现
        throw new UnsupportedOperationException();
    }
}
```
树枝构件使用一个容器存储了其下的叶子构件和树枝构件
```
public class Composite extends Component {
    //构件容器
    private ArrayList<Component> componentArrayList = new ArrayList<Component>();
    
    //增加一个叶子构件或树枝构件
    public void add(Component component){
        this.componentArrayList.add(component);
    }
    
    //删除一个叶子构件或树枝构件
    public void remove(Component component){
        this.componentArrayList.remove(component);
    }
    
    //获得分支下的所有叶子构件和树枝构件
    public ArrayList<Component> getChildren(){
        return this.componentArrayList;
    }
}

```
调用过程：
```
public class Client {
    public static void main(String[] args) {
        //创建一个根节点
        Composite root = new Composite();
        root.doSomething();
        
        //创建一个树枝构件
        Composite branch = new Composite();
        //创建一个叶子节点
        Leaf leaf = new Leaf();

        //建立整体
        root.add(branch);
        branch.add(leaf);
    }
    
    //通过递归遍历树
    public static void display(Component root){
        for(Component c:root.getChildren()){
            if(c instanceof Leaf){ //叶子节点
                c.doSomething();
            }else{ //树枝节点
                display(c);
            }
        }
    }
}
```
有些情况下，叶子节点和树枝节点的功能是一样的，比如Zookeeper中的Znode，这时候我们可以用透明组合模式。但是还有些情况下，叶子节点是无法添加和获取子节点的，这些方法在叶子节点中定义是无意义的，比如文件目录结构，文件不能跟目录一样添加和获取文件，所以针对这个问题，我们可以采用安全组合模式。

## 安全组合模式

安全组合模式就是在在抽象类Component中不声明任何用于管理成员对象的方法(add()、remove())，只声明叶子和树枝共同需要的方法，在树枝类中声明只有他需要的方法。这种做法是安全的。它的结构如下：

![](/assets/upload/2020-03/1583546425.png)

安全组合模式的缺点是不够透明，因为叶子和树枝具有不同的方法，且树枝中那些用于管理成员对象的方法没有在抽象类中定义，因此客户端不能完全针对抽象编程，必须有区别地对待叶子和树枝。

代码实现：

抽象构件只定义叶子与树枝构件共有的方法
```
public abstract class Component {

    //个体和整体都具有的共享
    public void doSomething(){
        //编写业务逻辑
    }
}
```

叶子节点所实现的方法都是自己需要的，而不用强制去实现树枝构件需要的方法。
```
public class Leaf extends Component {
     //可以覆写父类方法
     public void doSomething(){

     }
}

```

树枝构件同样只实现需要的方法
```
public class Composite extends Component {
    //构件容器
    private ArrayList<Component> componentArrayList = new ArrayList<Component>();
    
    //增加一个叶子构件或树枝构件
    public void add(Component component){
        this.componentArrayList.add(component);
    }
    
    //删除一个叶子构件或树枝构件
    public void remove(Component component){
        this.componentArrayList.remove(component);
    }
    
    //获得分支下的所有叶子构件和树枝构件
    public ArrayList<Component> getChildren(){
        return this.componentArrayList;
    }
}

```
调用过程
```
public class Client {
    public static void main(String[] args) {
        //创建一个根节点
        Composite root = new Composite();
        root.doSomething();
        
        //创建一个树枝构件
        Composite branch = new Composite();
        //创建一个叶子节点
        Leaf leaf = new Leaf();
        
        //建立整体
        root.add(branch);
        branch.add(leaf);        
    }
    
    //通过递归遍历树
    public static void display(Composite root) {
        for (Component c : root.getChildren()) {
            if (c instanceof Leaf) { //叶子节点
                c.doSomething();
            } else { //树枝节点
                display((Composite)c);
            }
        }
    }
}
```

## 组合模式的优缺点

+ 优点：
	+ 统一了组合对象和叶子对象。
	+ 简化了客户端调用，无须区分操作的是组合对象还是叶子对象。
	+ 更容易扩展，有了Component的约束，新定义的Composite或Leaf子类能够很容易地与已有的结构一起工作。

+ 缺点：
	+ 树枝和树叶的定义直接使用了实现类，在面向接口编程上不是很恰当，与依赖倒置原则冲突。
	+ 很难限制组合中的组件类型。
