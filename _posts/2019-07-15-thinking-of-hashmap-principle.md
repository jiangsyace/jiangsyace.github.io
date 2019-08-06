---
title: HashMap原理简单认识
date: 2019-7-15
categories:
- tech
tags:
- java
---

HashMap经常使用，但是对原理还是一知半解，整理记录一下JDK7中HashMap的源码，印象会更深刻。

<!-- more -->

### 什么是HashMap?
HashMap是一个基于数组和链表的数据结构。数组中的每一个位置被当成一个桶(bucket)，一个桶存放一个链表。链表是用来解决hash冲突的，同一个链表中存放哈希值相同的元素。  

HashMap在计算桶下标的时候采用散列算法，目的是为了使元素尽量分布均匀，避免单个链表过大造成性能问题。

### 应用场景对比
+ HashMap：实现了Map接口，键唯一，允许null值，非线程安全，效率高
+ HashTable：使用Synchronize关键字保证线程安全，效率低
+ HashSet：实现了Set接口，键不允许null值，不是键值对结构，仅仅是存储不重复的元素，相当于简化版的HashMap，只是包含HashMap中的key而已，HashSet内部就是使用HashMap实现，只不过HashSet里面的HashMap所有的value都是同一个Object而已，因此HashSet也是非线程安全的。
+ ConcurrentHashMap：使用分段锁保证线程安全，效率高

### 源码解析

#### 数据结构

```
/** 默认的初始容量为16. */
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

/** 最大容量，初始容量不能超过该大小. */
static final int MAXIMUM_CAPACITY = 1 << 30;

/** 默认的负载因子 */
static final float DEFAULT_LOAD_FACTOR = 0.75f;

/** 存储链表的数组，长度必须是2的次幂. */
transient Entry<K,V>[] table = (Entry<K,V>[]) EMPTY_TABLE;

/** map中键值对的总数. */
transient int size;

/** 下次扩容的临界值，size>=threshold就会扩容，满足公式threshold=loadFactor * capacity */
int threshold;

/** 负载因子 */
final float loadFactor;

/** 被修改结构的次数，其他方式修改内部结构（比如其他线程），用于使HashMap集合视图上的迭代器快速失败 */
transient int modCount;

//从构造函数可以看出，Entry就是一个链表的数据结构
static class Entry<K,V> implements Map.Entry<K,V> {
    final K key;
    V value;
    Entry<K,V> next;
    int hash;

    Entry(int h, K k, V v, Entry<K,V> n) {
        value = v;
        next = n;
        key = k;
        hash = h;
    }
}

```

#### 构造函数

```
/**
 * 指定初始容量和负载因子来构造一个空的HashMap
 * 如果初始容量是负数或者负载因子不是正数，则抛出异常
 */
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                            initialCapacity);
    //初始容量不能超过默认的最大容量(2的幂方中最大值)
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                            loadFactor);

    this.loadFactor = loadFactor;
    //临界值，超过临界值需要扩充容量
    threshold = initialCapacity;
    init();
}

/**
 * 指定初始容量和负载因子来构造一个空的HashMap
 * 负载因子使用默认值(0.75).
 */
public HashMap(int initialCapacity) {
    this(initialCapacity, DEFAULT_LOAD_FACTOR);
}
/**
 * 构造一个空的HashMap
 * 初始容量使用默认值(16),负载因子使用默认值(0.75).
 */
public HashMap() {
    this(DEFAULT_INITIAL_CAPACITY, DEFAULT_LOAD_FACTOR);
}
/**
 * 构造一个映射关系与指定Map相同的HashMap
 * 新HashMap使用默认的负载因子(0.75).初始容量经过计算，将指定Map大小增加1/3的容量(除以负载因子0.75)，最小值为默认容量
 */
public HashMap(Map<? extends K, ? extends V> m) {
    this(Math.max((int) (m.size() / DEFAULT_LOAD_FACTOR) + 1,
                    DEFAULT_INITIAL_CAPACITY), DEFAULT_LOAD_FACTOR);
    inflateTable(threshold);

    putAllForCreate(m);
}
```

#### put方法

```
public V put(K key, V value) {
    if (table == EMPTY_TABLE) {
        //table为空，扩充容量
        inflateTable(threshold);
    }
    //key只能存在一个null值，所以单独处理
    if (key == null)
        return putForNullKey(value);
    //计算key的hash码
    int hash = hash(key);
    //通过hash码计算桶下标
    int i = indexFor(hash, table.length);
    //取出指定下标的元素(桶)，并循环单链表，判断key是否已经存在
    for (Entry<K,V> e = table[i]; e != null; e = e.next) {
        Object k;
        //哈希码相同并且对象相同时，新值替换旧值，并返回旧值
        if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
            V oldValue = e.value;
            e.value = value;
            e.recordAccess(this);
            return oldValue;
        }
    }
    //修改数自增，用户判断是否被其他线程修改
    modCount++;
    //key值不存在，加入新元素
    addEntry(hash, key, value, i);
    return null;
}
/**
 * 初始化table容量，新建一个数组.
 */
private void inflateTable(int toSize) {
    // 计算要变更的容量大小，结果为不大于toSize的最大的2的N次方，保证了table的容量是2的N次方
    int capacity = roundUpToPowerOf2(toSize);

    threshold = (int) Math.min(capacity * loadFactor, MAXIMUM_CAPACITY + 1);
    table = new Entry[capacity];
    initHashSeedAsNeeded(capacity);
}
/**
 * 存放key为null的值.
 */
private V putForNullKey(V value) {
    //固定放在table中的第一位。
    for (Entry<K,V> e = table[0]; e != null; e = e.next) {
        //当前位置已经存在链表，判断链表中是否包含key为null的entry
        if (e.key == null) {
            //存在则替换原有entry，返回旧entry的value
            V oldValue = e.value;
            e.value = value;
            e.recordAccess(this);
            return oldValue;
        }
    }
    //修改数自增，用于判断是否被其他线程修改过
    modCount++;
    //数组第一位不存在链表，或者存在链表但是没有key为null的entry，则在table第一位添加一个entry
    addEntry(0, null, value, 0);
    return null;
}
/**
 * 添加键值对.
 */
void addEntry(int hash, K key, V value, int bucketIndex) {
    //如果map大小大于临界值，并且当前桶的位置不为空，则对table进行扩容
    if ((size >= threshold) && (null != table[bucketIndex])) {
        //扩容至目前大小的2倍（创建一个新的table，把旧的table所有元素加到新table中，所以尽量避免扩容）
        resize(2 * table.length);
        hash = (null != key) ? hash(key) : 0;
        //通过hash码计算桶下标
        bucketIndex = indexFor(hash, table.length);
    }
    createEntry(hash, key, value, bucketIndex);
}
/**
 * 创建新Entry，如果当前桶内存在链表，将新Entry作为表头next指向原有Entry.
 */
void createEntry(int hash, K key, V value, int bucketIndex) {
    Entry<K,V> e = table[bucketIndex];
    table[bucketIndex] = new Entry<>(hash, key, value, e);
    size++;
}
/**
 * 根据key的hash值和table大小计算桶的下标.
 */
static int indexFor(int h, int length) {
    // assert Integer.bitCount(length) == 1 : "length must be a non-zero power of 2";
    //length为table大小(2^n),length-1使得低位全为1，高位全为0，位与之后的结果一定在0 -> n-1的范围内
    //如果length不是2的次幂，例如length为 15，length-1为14转换为二进制为1110，再于h与操作，最后一位都是0，
    //而0011，0101，1001，1011，0111，1101这几个位置永远不能存放元素，空间浪费相当大，
    //更糟的是这种情况中，数组可以使用的位置比数组长度小了很多，这意味着进一步增加了碰撞的几率，减慢了查询的效率！这样就会造成空间的浪费。
    return h & (length-1);
}
```
在计算桶下标的过程中，`h & (length-1)` 这个位运算等同于`h % length`。当然，前提是length必须是2^n，原因如下：  
初始容量 x = 1 << 4，即 x 为2的4次方，转换成2进制如下：  
```
x   : 00010000  
x-1 : 00001111  
```
将一个数 y 与 x-1 做与运算，可以去除 y 位级表示的第 4 位以上数： 
``` 
y       : 10010100  
x-1     : 00001111  
y&(x-1) : 00000010  
```
这个性质使 y & （x - 1）和 y 对 x 取模效果是一样的： 
``` 
y   : 10010100  
x   : 00010000  
y%x : 00000100  
```

位运算的代价比求模运算小的多，因此在进行这种计算时用位运算的话能带来更高的性能。  

**所以：HashMap确定桶下标的最后一步是将key的hash值对table容量取模：hash % capacity。如果能保证 capacity为2的n次方，那么就可以将这个操作转换为位运算。**


#### get方法

```
public V get(Object key) {
    if (key == null)
        return getForNullKey();
    //根据key获取键值对
    Entry<K,V> entry = getEntry(key);

    //这里没有找到键值对或者值为null都有可能返回null，这也是为什么不能使用get方法来判断key是否存在，
    //应该使用containsKey，containsKey中只判断entry是否等于null
    return null == entry ? null : entry.getValue();
}
final Entry<K,V> getEntry(Object key) {
    //map大小为0，不存在任何值，直接返回null
    if (size == 0) {
        return null;
    }
    //计算key的hash值
    int hash = (key == null) ? 0 : hash(key);
    //循环桶内单链表，获取key值一样的entry
    for (Entry<K,V> e = table[indexFor(hash, table.length)];
            e != null;
            e = e.next) {
        Object k;
        if (e.hash == hash &&
            ((k = e.key) == key || (key != null && key.equals(k))))
            return e;
    }
    return null;
}
```

### 扩展问题
+ 为什么String, Interger这样的wrapper类适合作为键？ 
  + String, Interger这样的wrapper类作为HashMap的键是再适合不过了，而且String最为常用。因为String是不可变的，也是final的，而且已经重写了equals()和hashCode()方法了。其他的wrapper类也有这个特点。不可变性是必要的，因为为了要计算hashCode()，就要防止键值改变，如果键值在放入时和获取时返回不同的hashcode的话，那么就不能从HashMap中找到你想要的对象。不可变性还有其他的优点如线程安全。如果你可以仅仅通过将某个field声明成final就能保证hashCode是不变的，那么请这么做吧。因为获取对象的时候要用到equals()和hashCode()方法，那么键对象正确的重写这两个方法是非常重要的。如果两个不相等的对象返回不同的hashcode的话，那么碰撞的几率就会小些，这样就能提高HashMap的性能。
+ 可以使用自定义的对象作为键吗？ 
  + 可以使用任何对象作为键，只要它遵守了equals()和hashCode()方法的定义规则，并且当对象插入到Map中之后将不会再改变了。如果这个自定义对象是不可变的，那么它已经满足了作为键的条件。
+ 可以使用CocurrentHashMap来代替HashTable吗？
  + HashTable是synchronized的，但是ConcurrentHashMap同步性能更好，因为它仅仅根据同步级别对map的一部分进行上锁。ConcurrentHashMap当然可以代替HashTable，但是HashTable提供更强的线程安全性。

