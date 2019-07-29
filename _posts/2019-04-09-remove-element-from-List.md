---
title: 如何在for循环中删除List的元素
date: 2019-4-9 16:09:32
categories:
- tech
tags:
- java
---

闲逛的时候看到一个问题：可以用for循环直接删除ArrayList的特定元素吗？可能会出现什么问题？怎样解决？
看到这个问题，我只记得循环中删除元素会报错，至于报错的原因还不是很清楚，于是重新整理了一下资料，记录一下。

<!-- more -->

首先遍历list可以分为两种，一种是for循环，根据下标遍历，另一种是foreach循环，使用迭代器遍历。虽然题目中是for循环，但是总结还是应该全面一点。
### for循环
+ 在循环中删除List元素的过程：
```
List<String> list = new ArrayList<String>(Arrays.asList("1", "2", "3", "4"));
for (int i = 0; i < list.size(); i++) {
    String item = list.get(i);
    if ("1".equals(item) || "2".equals(item)) {
        String oldValue = list.remove(i);
        System.out.println("删除元素：" + oldValue);
    }
}
System.out.println("list：" + Arrays.toString(list.toArray()));
```
执行后得到以下结果：
```
删除元素：1
list：[2, 3, 4]
```
显然是有问题的，“1”和“2”都应该删除的，那“2”没删除的原因是什么呢？
先看一下ArrayList中的remove方法：
```
public E remove(int index) {
    rangeCheck(index);

    modCount++;
    E oldValue = elementData(index);

    int numMoved = size - index - 1;
    if (numMoved > 0)
        System.arraycopy(elementData, index+1, elementData, index,
                            numMoved);
    elementData[--size] = null; // clear to let GC do its work

    return oldValue;
}
```
实现删除元素的代码的关键在于`System.arraycopy`方法，该方法的参数分别为:(原数组, 从元数据的起始位置开始, 目标数组, 目标数组的开始起始位置, 要copy的数组的长度)，所以实现删除元素的原理就是：复制从当前删除元素的后一位开始到数组最后一位，粘贴到本数组的当前删除元素的位置，等于就是把后面的元素全部向前移一位，覆盖掉当前删除的元素，再把最后一个元素设为空。比如删除元素“2”：`{"1", "2", "3", "4"} -> System.arraycopy -> {"1", "3", "4", "4"} -> {"1", "3", "4", null}`
也就是说，**在删除list的中间一个元素后，该元素后面所有的元素下标都发生了改变，向前移了一位，而for循环中的的循环变量只是在按顺序递增。**所以，在了解了list删除元素的过程后，解决这个问题的办法也很灵活：
```
// 1. 倒过来遍历list，从后面删除元素，不影响前面元素的下标。
for (int i = list.size() - 1; i >= 0; i--) {
    String item = list.get(i);
    if ("1".equals(item) || "2".equals(item)) {
        list.remove(i);
    }
}
// 2. 每移除一个元素以后再把循环变量i移回来
for (int i = 0; i < list.size(); i++) {
    String item = list.get(i);
    if ("1".equals(item) || "2".equals(item)) {
        list.remove(i);
        i = i-1;  
    }
}
// 3. 使用iterator.remove()方法，见下文。
```
**总结：在for循环中，可以删除List元素，但是会出现下标重新调整的问题，解决办法有以上三种**

### foreach循环
+ foreach循环本质是使用迭代器遍历。
```
for (type var : coll) {
    body-of-loop
}
```
相当于下面的写法
```
for (Iterator<type> iter = coll.iterator(); iter.hasNext(); ) {
    type var = iter.next();
    body-of-loop
}
```
> 1.For-each语法内部，对collection是用nested iteratoration来实现的，对数组是用下标遍历来实现。  
> 2.Java 5 及以上的编译器隐藏了基于iteration和下标遍历的内部实现。这里的实现，隐藏在了Java 编译器中，在编译中的语义分析过程中，有一个解除语法糖的操作。（语法糖是啥？可以理解成编译器为方便开发人员开发，会对特定代码做一些特殊处理，方便开发人员使用，除了foreach，java中还有泛型、装箱、拆箱、变长字符串等）。

+ 在迭代器中删除List元素的过程
```
List<String> list = new ArrayList<String>(Arrays.asList("1", "2", "3", "4"));
for (String item : list) {
    list.remove(item);
    System.out.println("删除元素：" + item);
}
System.out.println("list：" + Arrays.toString(list.toArray()));
```
代码执行结果如下：
```
删除元素：1
Exception in thread "main" java.util.ConcurrentModificationException
	at java.util.ArrayList$Itr.checkForComodification(ArrayList.java:859)
	at java.util.ArrayList$Itr.next(ArrayList.java:831)
	at com.jiangsy.util.algorithmic.BasicStatProxy.main(BasicStatProxy.java:21)
```
可以看到第一个元素删除了，再删除第二个元素的时候抛异常了。跟踪错误信息中的代码发现：  
``` 
public E next() {
    checkForComodification();
    int i = cursor;
    if (i >= size)
        throw new NoSuchElementException();
    Object[] elementData = ArrayList.this.elementData;
    if (i >= elementData.length)
        throw new ConcurrentModificationException();
    cursor = i + 1;
    return (E) elementData[lastRet = i];
}
public void remove() {
    if (lastRet < 0)
        throw new IllegalStateException();
    checkForComodification();

    try {
        ArrayList.this.remove(lastRet);
        cursor = lastRet;
        lastRet = -1;
        expectedModCount = modCount;
    } catch (IndexOutOfBoundsException ex) {
        throw new ConcurrentModificationException();
    }
}
final void checkForComodification() {
    if (modCount != expectedModCount)
        throw new ConcurrentModificationException();
}
```
在迭代器遍历下一个元素和移除元素时，首先会调用`checkForComodification`方法校验`modCount`和`expectedModCount`是否相等，也就是**创建迭代对象的时候List的修改次数与当前迭代器中的修改次数是否一样**，不一样则抛出并发修改异常（这里抛异常的原因也能理解，ArrayList是线程不安全的，在发现修改次数不一致说明其他线程也在修改，所以直接抛出异常）。那么到底什么原因导致这两个属性不一样呢？可以看到，remove方法中最后将`expectedModCount = modCount;`也就是说，如果调用了迭代器中的remove方法，两个值是会相等的，很明显，测试代码中调用的是list中的remove方法：  
```
public boolean remove(Object o) {
    if (o == null) {
        for (int index = 0; index < size; index++)
            if (elementData[index] == null) {
                fastRemove(index);
                return true;
            }
    } else {
        for (int index = 0; index < size; index++)
            if (o.equals(elementData[index])) {
                fastRemove(index);
                return true;
            }
    }
    return false;
}
private void fastRemove(int index) {
    modCount++;
    int numMoved = size - index - 1;
    if (numMoved > 0)
        System.arraycopy(elementData, index+1, elementData, index,
                            numMoved);
    elementData[--size] = null; // clear to let GC do its work
}
```
可以看出，`fastRemove`中修改了`modCount`参数，而当前迭代器对象的中`expectedModCount`仍然保持原样，于是在迭代器调用next方法检查修改次数时就报错了。解决方法很明显，将调用list的remove方法改为迭代器的remove方法就行，这时只能显式创建迭代器Iterator去调用remove方法，而不能使用语法糖，如下：  
```
List<String> list = new ArrayList<String>(Arrays.asList("1", "2", "3", "4"));
Iterator<String> iterator = list.iterator();
while (iterator.hasNext()) {
    String item = iterator.next();
    iterator.remove();
    System.out.println("删除元素：" + item);
}
```
**总结：foreach循环中也可以删除List元素，但是要注意：要使用迭代器的remove方法，不能用List的remove方法，否则在迭代器Iterator检查下一个元素时，会收获一个异常。**

### 参考
[https://www.cnblogs.com/vhua/p/5299709.html](https://www.cnblogs.com/vhua/p/5299709.html)  
[https://www.cnblogs.com/slwenyi/p/6393366.html](https://www.cnblogs.com/slwenyi/p/6393366.html)  
[https://blog.csdn.net/weixin_39032575/article/details/80724984](https://blog.csdn.net/weixin_39032575/article/details/80724984)