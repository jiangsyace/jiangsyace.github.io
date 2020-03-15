---
title: Java设计模式——原型模式
date: 2020-03-15
categories:
- tech
tags:
- java
- design pattern
---

原型模式（Prototype）属于对象的创建模式。通过给出一个原型对象来指明所有创建的对象的类型，然后通过复制这个原型对象来创建出更多同类型的对象。这就是原型模式的用意。

<!-- more -->

原型模式涉及到3个角色：
+ 客户(Client)角色：客户类提出创建对象的请求。
+ 抽象原型(Prototype)角色：这是一个抽象角色，通常由一个Java接口或Java抽象类实现。此角色给出所有的具体原型类所需的接口。
+ 具体原型（Concrete Prototype）角色：被复制的对象。此角色需要实现抽象的原型角色所要求的接口。

原型模式的实现可分为简单形式和登记形式。

## 原型模式的实现

**简单形式**
抽象原型角色
```
public interface Prototype{
    /**
     * 克隆自身的方法
     * @return 一个从自身克隆出来的对象
     */
    Prototype clone();
}
```

具体原型角色
```
public class ConcretePrototype1 implements Prototype {
    public Prototype clone() {
        //最简单的克隆，新建一个自身对象，由于没有属性就不再复制值了
        Prototype prototype = new ConcretePrototype1();
        return prototype;
    }
}
public class ConcretePrototype2 implements Prototype {
    public Prototype clone() {
        //最简单的克隆，新建一个自身对象，由于没有属性就不再复制值了
        Prototype prototype = new ConcretePrototype2();
        return prototype;
    }
}
```

客户端调用过程
```
public class Client {
    /**
     * 持有需要使用的原型接口对象
     */
    private Prototype prototype;
    /**
     * 构造方法，传入需要使用的原型接口对象
     */
    public Client(Prototype prototype) {
        this.prototype = prototype;
    }
    public void operation(Prototype example) {
        //需要创建原型接口的对象
        Prototype copyPrototype = prototype.clone();
        
    }
}
```

**登记形式**
作为原型模式的第二种形式，它多了一个原型管理器(PrototypeManager)角色，该角色的作用是：创建具体原型类的对象，并记录每一个被创建的对象。

抽象原型角色
```
public interface Prototype {
    public Prototype clone();
    public String getName();
    public void setName(String name);
}
```

具体原型角色
```
public class ConcretePrototype1 implements Prototype {
    private String name;
    public Prototype clone() {
        ConcretePrototype1 prototype = new ConcretePrototype1();
        prototype.setName(this.name);
        return prototype;
    }
    public String toString() {
        return "Now in Prototype1 , name = " + this.name;
    }
    @Override
    public String getName() {
        return name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }
}
public class ConcretePrototype2 implements Prototype {
    private String name;
    public Prototype clone() {
        ConcretePrototype2 prototype = new ConcretePrototype2();
        prototype.setName(this.name);
        return prototype;
    }
    public String toString() {
        return "Now in Prototype2 , name = " + this.name;
    }
    @Override
    public String getName() {
        return name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }
}
```

原型管理器角色保持一个聚集，作为对所有原型对象的登记，这个角色提供必要的方法，供外界增加新的原型对象和取得已经登记过的原型对象。
```
public class PrototypeManager {
    /**
     * 用来记录原型的编号和原型实例的对应关系
     */
    private static Map<String, Prototype> map = new HashMap<String, Prototype>();
    /**
     * 私有化构造方法，避免外部创建实例
     */
    private PrototypeManager() {}
    /**
     * 向原型管理器里面添加或是修改某个原型注册
     * @param prototypeId 原型编号
     * @param prototype    原型实例
     */
    public synchronized static void setPrototype(String prototypeId , Prototype prototype) {
        map.put(prototypeId, prototype);
    }
    /**
     * 从原型管理器里面删除某个原型注册
     * @param prototypeId 原型编号
     */
    public synchronized static void removePrototype(String prototypeId) {
        map.remove(prototypeId);
    }
    /**
     * 获取某个原型编号对应的原型实例
     * @param prototypeId    原型编号
     * @return    原型编号对应的原型实例
     * @throws Exception    如果原型编号对应的实例不存在，则抛出异常
     */
    public synchronized static Prototype getPrototype(String prototypeId) throws Exception {
        Prototype prototype = map.get(prototypeId);
        if (prototype == null) {
            throw new Exception("您希望获取的原型还没有注册或已被销毁");
        }
        return prototype;
    }
}
```

客户端角色
```
public class Client {
    public static void main(String[]args) {
        try {
            Prototype p1 = new ConcretePrototype1();
            PrototypeManager.setPrototype("p1", p1);
            //获取原型来创建对象
            Prototype p3 = PrototypeManager.getPrototype("p1").clone();
            p3.setName("张三");
            System.out.println("第一个实例：" + p3);
            //有人动态的切换了实现
            Prototype p2 = new ConcretePrototype2();
            PrototypeManager.setPrototype("p1", p2);
            //重新获取原型来创建对象
            Prototype p4 = PrototypeManager.getPrototype("p1").clone();
            p4.setName("李四");
            System.out.println("第二个实例：" + p4);
            //有人注销了这个原型
            PrototypeManager.removePrototype("p1");
            //再次获取原型来创建对象
            Prototype p5 = PrototypeManager.getPrototype("p1").clone();
            p5.setName("王五");
            System.out.println("第三个实例：" + p5);
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}
```

**两种形式的比较**
+ 如果需要创建的原型对象数目较少而且比较固定的话，可以采取第一种形式。在这种情况下，原型对象的引用可以由客户端自己保存。
+ 如果要创建的原型对象数目不固定的话，可以采取第二种形式。在这种情况下，客户端不保存对原型对象的引用，这个任务被交给管理员对象。在复制一个原型对象之前，客户端可以查看管理员对象是否已经有一个满足要求的原型对象。如果有，可以直接从管理员类取得这个对象引用；如果没有，客户端就需要自行复制此原型对象。

## Java中的原型模式

在JAVA里，通过克隆(`Clone()`)方法来实现原型模式。

克隆的实现方法有两种：

+ 浅拷贝:只负责克隆按值传递的数据（比如基本数据类型、String类型），而不复制它所引用的对象，换言之，所有的对其他对象的引用都仍然指向原来的对象。。

+ 深拷贝:除了浅度克隆要克隆的值外，还负责克隆引用类型的数据。那些引用其他对象的变量将指向被复制过的新对象，而不再是原有的那些被引用的对象。

**浅克隆的实现**

+ 实现java.lang.Cloneable接口
    + 实现Cloneable接口，不包含任何方法，仅仅是用来指示Object类中clone()方法可以用来合法的进行克隆。
    + 如果在没有实现Cloneable接口的实例上调用Object的clone()方法，则会导致抛出CloneNotSupportedException   
    + 实现此接口的类，应该使用public，重写Object的clone方法。Object类中的clone()是一个protected属性的方法重写之后要把clone()方法的属性设置为public。因为在Object类中的clone()方法是一个native方法，native方法的效率一般来说都是远高于java中的非native方法，这也解释了为什么要用Object中clone()方法而不是先new一个类，然后把原始对象中的信息赋到新对象中，虽然这也实现了clone功能。
+ 重写java.lang.Object.clone()方法

```
public class PrototypeClass implements Cloneable {
	//覆写父类Object方法
	@Override
	public PrototypeClass clone() {
		PrototypeClass prototypeClass = null;
		try {
			prototypeClass = (PrototypeClass)super.clone();
		} catch (CloneNotSupportedException e) {
			//异常处理
		}
		return prototypeClass;
	}
}
```

**深度克隆的实现**
利用序列化和反序列化，实现Serializable接口，然后将对象写进二进制流里，再从二进制流里读出新对象
```
public Object deepClone() throws IOException, ClassNotFoundException {
    //将对象写到流里
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    ObjectOutputStream oos = new ObjectOutputStream(bos);
    oos.writeObject(this);
    //从流里读回来
    ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
    ObjectInputStream ois = new ObjectInputStream(bis);
    return ois.readObject();
}
```

## 原型模式的优缺点
+ 优点
	+ 性能优良，基于内存的二进制流的拷贝，要比直接new一个对象的性能好很多，特别是在一个循环体内产生大量的对象时，原型模式能更好地体现其优点。
    + 逃避构造函数的约束，直接在内存中拷贝，构造函数不会执行，这既是它的优点也是缺点。
+ 缺点
	+ 原型模式最主要的缺点是每一个类都必须配备一个克隆方法。配备克隆方法需要对类的功能进行通盘考虑，这对于全新的类来说不是很难，而对于已经有的类不一定很容易，特别是当一个类引用不支持序列化的间接对象，或者引用含有循环结构的时候。
