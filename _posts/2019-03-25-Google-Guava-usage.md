---
title: Google Guava 类库用法整理
date: 2019-3-25 20:10:26
categories:
- teh
tags:
- java
- Guava
---

Guava经常用，但好像总是用到很少的一部分，所以把 Guava 中的常用工具方法都捋一遍，避免以后重复造轮子。

<!-- more -->

### 准备工作

Guava 是一个工具包，直接在maven项目中加入依赖就可以使用了
```
<dependency>
	<groupId>com.google.guava</groupId>
	<artifactId>guava</artifactId>
	<version>27.1-jre</version>
</dependency>
```

### 基本工具

#### 排序和过滤
```
//对可排序类型做自然排序，如数字按大小，日期按先后排序
List sortl = Ordering.natural().sortedCopy(l);
//按对象的字符串形式做字典排序
Ordering.usingToString();
//自定义排序器 - 比较字符串长度
Ordering<String> byLengthOrdering = new Ordering<String>() {
    public int compare(String left, String right) {
        return Ints.compare(left.length(), right.length());
    }
};

//排序器能够支持链式调用
Ordering.natural()
        //获取语义相反的排序器
        .reverse()
        //使用当前排序器，但额外把null值排到最前面
        .nullsFirst()
        //使用当前排序器，但额外把null值排到最后面
        .nullsLast()
        //合成另一个比较器，以处理当前排序器中的相等情况。
        .compound(new Comparator<Integer>() {
            @Override
            public int compare(Integer i, Integer j) {
                return 0;
            }
        })
        //基于处理类型T的排序器，返回该类型的可迭代对象Iterable<T>的排序器
        .lexicographical();
//对集合中元素调用Function，再按返回值用当前排序器排序
class Foo {
    @Nullable
    String sortedBy;

    int notSortedBy;
}
Ordering<Foo> ordering = Ordering.natural().nullsFirst().onResultOf(new Function<Foo, String>() {
    public String apply(Foo foo) {
        return foo.sortedBy;
    }
});
//以下是具体排序方法
//获取可迭代对象中最大的k个元素。
Ordering.natural().greatestOf(l, 3);
//判断可迭代对象是否已按排序器排序：允许有排序值相等的元素。
Ordering.natural().isOrdered(l);
//进行排序 并把排序结果copy成另一个集合
List sortedl = Ordering.natural().sortedCopy(l);
//返回两个参数中最小的那个。如果相等，则返回第一个参数。
Ordering.natural().min(1, 2);
//返回多个参数中最小的那个。如果有超过一个参数都最小，则返回第一个最小的参数。
Ordering.natural().min(1, 2, 3, 4);
//返回迭代器中最小的元素。如果可迭代对象中没有元素，则抛出NoSuchElementException。
Ordering.natural().min(l);
//同理max
Ordering.natural().max(1, 2);

//根据包含的字符串过滤
List<String> names = Lists.newArrayList("John", "Jane", "Adam", "Tom");
Iterable<String> result = Iterables.filter(names, Predicates.containsPattern("a"));
Collection<String> result = Collections2.filter(names, Predicates.containsPattern("a"));
```

### 集合

#### 不可变集合
用不变的集合进行防御性编程和性能提升。
```
//集合前面加上Immutable
ImmutableSet.of("a", "b", "c");
ImmutableSortedSet.of("a", "b", "c", "a", "d", "b");
ImmutableMap.of("k1", "v1", "k2", "v2");
ImmutableList.copyOf(Lists.newArrayList("a", "b", "c"));
ImmutableSet.<Color>builder().add(new Color(0, 255, 255)).add(new Color(0, 191, 255)).build();
```
#### 新集合类型
+ Multiset：可存放重复元素，有计数功能
  + HashMultiset: 元素存放于 HashMap
  + LinkedHashMultiset: 元素存放于 LinkedHashMap，即元素的排列顺序由第一次放入的顺序决定
  + TreeMultiset:元素被排序存放于TreeMap
  + EnumMultiset: 元素必须是 enum 类型
  + ImmutableMultiset: 不可修改的 Mutiset  

    ```
    //统计单词出现的次数
    String str = "this is a cat and that is a mice where is the food ";
    String[] letters = str.split(" ");
    Multiset<String> set = HashMultiset.create();
    for(String letter : letters){
        set.add(letter);
    }
    for(String letter : set.elementSet()){
        System.err.println(letter + ":" + set.count(temp));
    }
    for(Multiset.Entry<String> entry : set.entrySet()){
        System.out.println(entry.getElement() + ":" + entry.getCount());
    }
    ```

+ Multimap：一键多值的Map
  + ArrayListMultiMap 
  + HashMultiMap
  + LinkedListMultimap
  + LinkedHashMultimap
  + TreeMultimap
  + ImmutableListMultimap
  + ImmutableSetMultimap
+ BiMap：键值双向映射，支持键值反转
  + HashBiMap: key 集合与 value 集合都有 HashMap 实现
  + EnumBiMap: key 与 value 都必须是 enum 类型
  + ImmutableBiMap: 不可修改的 BiMap
+ Table：表结构，可以通过行和列取出对应的值（基于列的操作会比基于行的操作效率差些）
  + ArrayTable：在构建时就要定下行和列，固定长度后不可变，行与列的键值不可为Null。这种表格由二维数组实现，这样可以在密集数据的表格的场合，提高时间和空间的效率。非线程安全
  + HashBasedTable：基于HashMap<R, HashMap<C, V>>的实现。非线程安全
  + TreeBasedTable：基于TreeMap<R, TreeMap<C, V>>的实现。可以通过自身的comparator比较大小进行排序。
  + ImmutableTable：基于ImmutableMap<R, ImmutableMap<C, V>>的实现。相当于只读。许多其他重要属性在ImmutableCollection
+ MutableClassToInstanceMap：键是类型，而值是符合键所指类型的对象。泛型限制了键类型只能是同一种类型或其子类型。
  ```
    //Guava提供了两种有用的实现：MutableClassToInstanceMap 和 ImmutableClassToInstanceMap。
    ClassToInstanceMap<Number> numberDefaults = MutableClassToInstanceMap.create();
    numberDefaults.putInstance(Integer.class, 1);
    numberDefaults.putInstance(Double.class, 1D);
  ```
+ RangeSet：存储一些不为空的也不相交的范围的数据结构。
    ```
    //当添加一个range到一个RangeSet之后，任何有连续的range将被自动合并，而空的range将被自动去除
    RangeSet<Integer> rangeSet = TreeRangeSet.create();
    rangeSet.add(Range.closed(1, 10));// [[1..10]]
    rangeSet.add(Range.closedOpen(11, 15));// 不相连区间:[[1..10], [11..15)]
    rangeSet.add(Range.open(15, 20)); // 相连区间，自动合并:[[1..10], [11..15), (15..20)]
    rangeSet.add(Range.openClosed(0, 0));// 空区间，自动去除:[[1..10], [11..15), (15..20)]
    rangeSet.remove(Range.open(5, 10)); // 分割:[[1..5], [10..10], [11..15), (15..20)]
    System.out.println(rangeSet);
    ```
+ RangeMap：非连续非空的range对应的集合。和RangeSet不同，RangeMap不会合并相邻的映射，即便相邻的区间映射到相同的值
    ```
    RangeMap<Integer, String> rangeMap = TreeRangeMap.create();
    rangeMap.put(Range.closed(1, 10), "foo"); //{[1,10] => "foo"}
    rangeMap.put(Range.open(3, 6), "bar"); //{[1,3] => "foo", (3,6) => "bar", [6,10] => "foo"}
    rangeMap.put(Range.open(10, 20), "foo"); //{[1,3] => "foo", (3,6) => "bar", [6,10] => "foo", (10,20) => "foo"}
    rangeMap.remove(Range.closed(5, 11)); //{[1,3] => "foo", (3,5) => "bar", (11,20) => "foo"}
    ```
#### 集合工具类
提供java.util.Collections中没有的集合工具，如Maps、Lists、Sets  

```
//推断范型，初始化元素和容量的静态工厂方法
List<Color> colorList = Lists.newArrayList();
Map<String, Color> colorMap = Maps.newLinkedHashMap();

List<Integer> intList = Ints.asList(4, 5, 6);
Set<Integer> sets = Sets.newHashSet(1, 2, 3, 4, 5);
Set<Integer> sets2 = Sets.newHashSet(4, 5, 6, 7, 8);
List<String> theseElements = Lists.newArrayList("alpha", "beta", "gamma");
List<Color> exactly100 = Lists.newArrayListWithCapacity(100);
List<Color> approx100 = Lists.newArrayListWithExpectedSize(100);
Set<Color> approx100Set = Sets.newHashSetWithExpectedSize(100);
Table<Integer, Integer, Integer> table = HashBasedTable.create();

//把Table<C, R, V>转置成Table<R, C, V> 也就是行列互换
Tables.transpose(table);
//反转List
List<String> thoseElements = Lists.reverse(theseElements);
//指定大小分割
List<List<String>> conList = Lists.partition(thoseElements, 3);

//两个map比较  
Map<String, Integer> left = ImmutableMap.of("a", 1, "b", 2, "c", 3);
Map<String, Integer> right = ImmutableMap.of("b", 2, "c", 4, "d", 4);
//Maps.difference(Map, Map)用来比较两个Map以获取所有不同点。该方法返回MapDifference对象，把不同点的维恩图分解
MapDifference<String, Integer> mapDiff = Maps.difference(left, right);
//找到键值对都相等的
mapDiff.entriesInCommon(); // {"b" => 2}
//找到键相等值不想等的
mapDiff.entriesDiffering(); // {"c" => 3},{"c" => 4}
//找到只存在于左边的，匹配key
mapDiff.entriesOnlyOnLeft(); // {"a" => 1}
//找到只存在于右边的，匹配key
mapDiff.entriesOnlyOnRight(); // {"d" => 5}
//两个map是否相等
System.out.println(mapDiff.areEqual()); // false

// 交集
SetView<Integer> intersection = Sets.intersection(sets, sets2);
// 差集
SetView<Integer> setDiff = Sets.difference(sets, sets2);
// 并集
SetView<Integer> union = Sets.union(sets, sets2);
//笛卡尔积
Set<String> animals = ImmutableSet.of("gerbil", "hamster");  
Set<String> fruits = ImmutableSet.of("apple", "orange", "banana");  
Set<List<String>> product = Sets.cartesianProduct(animals, fruits);  

//Iterables工具类连接两个Iterable（集合）
Iterable<Integer> concatenated = Iterables.concat(Ints.asList(1, 2, 3), Ints.asList(4, 5, 6));

//集合数据转换
List<String> strList = Lists.newArrayList("1", "2", "3");
List<Integer> newList = Lists.transform(list, new Function<String, Integer>() {  
    @Override  
    public Integer apply(String input) {  
        return Integer.valueOf(input);  
    }  
});
ImmutableMap<String, String> newMap = Maps.uniqueIndex(strList, new Function<String, String>() {
    @Override
    public @Nullable String apply(@Nullable String input) {
        return input;
    }
});
```

### 缓存
Guava Cache：本地缓存实现，支持多种缓存过期策略  

```
// LoadingCache是Cache的缓存实现
LoadingCache<String, Object> cache = CacheBuilder.newBuilder()
        //设置缓存大小
        .maximumSize(1000)
        //设置到期时间
        .expireAfterWrite(10, TimeUnit.MINUTES)
        //设置缓存里的值两分钟刷新一次
        .refreshAfterWrite(2,TimeUnit.MINUTES)
        //开启缓存的统计功能
        .recordStats()
        //构建缓存
        .build(new CacheLoader<String, Object>() {
            //此处实现如果根据key找不到value需要去如何获取
            @Override
            public Object load(String s) throws Exception {
                return new Object();
            }
            //如果批量加载有比反复调用load更优的方法则重写这个方法
            @Override
            public Map<String, Object> loadAll(Iterable<? extends String> keys) throws Exception {
                return super.loadAll(keys);
            }
        });
cache.put("k1", 100);
//获取缓存
cache.get("k1");
//除了在build的时候设置没有key的调用方法外我们还能在调用的时候手动写
String key = "k2";
cache.get(key, new Callable<Object>() {
    @Override
    public Object call() throws Exception {
        return new Object();
    }
});
//缓存回收
//除了不能超过大小和设定的时间自动回收外还可以调用方法手动回收
cache.invalidate("k1");//个别清除
cache.invalidateAll(Lists.newArrayList("k2", "k3"));//批量清除
cache.invalidateAll();//清除所有缓存项
//清理的时机：在写操作时顺带做少量的维护工作，或者偶尔在读操作时做——如果写操作实在太少的话
//如果想自己维护则可以调用Cache.cleanUp();
cache.cleanUp();
//另外有时候需要缓存中的数据做出变化重载一次,这个过程可以异步执行
cache.refresh("k1");
//还可以调用一下缓存的统计查看缓存的使用情况(需要在构建时开启)
CacheStats cacheStats = cache.stats();
cacheStats.hitRate();//缓存命中率
cacheStats.averageLoadPenalty();//加载新值的平均时间，单位为纳秒
cacheStats.evictionCount();//缓存项被回收的总数，不包括显式清除
```

### 字符串处理

**连接器[Joiner]**

```
List<String> list = Lists.newArrayList("a", null, "b");
System.out.println(Joiner.on("|").skipNulls().join(list));
System.out.println(Joiner.on("|").useForNull("none").join(list));
System.out.println(Joiner.on("/").join("a", "b", ""));

FileWriter fileWriter = new FileWriter(new File("C:/Users/Administrator/Desktop/from.txt"));
Joiner.on("#").useForNull(" ").appendTo(fileWriter, list);
fileWriter.flush();
fileWriter.close();

Map<String, String> map = Maps.newLinkedHashMap();
map.put("k1", "v1");
map.put("k2", "v2");
map.put("k3", "v3");
System.out.println(Joiner.on("&").withKeyValueSeparator("=").join(map));

ImmutableMap<String, String> map = ImmutableMap.of("id", "1", "name", "jack");
System.out.println(Joiner.on("&").withKeyValueSeparator("=").join(map));
```

**拆分器[Splitter]**

**拆分器工厂**

| 方法    | 描述       | 范例     |
| --------------- | :----------------- | :-------- |
| Splitter.on(char)          | 按单个字符拆分      | Splitter.on(‘;’)   |
| Splitter.on(CharMatcher)   | 按字符匹配器拆分    | Splitter.on(CharMatcher.BREAKING_WHITESPACE)   |
| Splitter.on(String)        | 按字符串拆分        | Splitter.on(“,   “)    |
| Splitter.on(Pattern) Splitter.onPattern(String) | 按正则表达式拆分    | Splitter.onPattern(“\r?\n”)    |
| Splitter.fixedLength(int)  | 按固定长度拆分；最后一段可能比给定长度短，但不会为空。 | Splitter.fixedLength(3)   |

**拆分器修饰符**

| 方法 |  描述 |
| --------   | :-----  |
| omitEmptyStrings()  | 	从结果中自动忽略空字符串  |
| trimResults()  | 	移除结果字符串的前导空白和尾部空白  |
| trimResults(CharMatcher)  | 	给定匹配器，移除结果字符串的前导匹配字符和尾部匹配字符  |
| limit(int)  | 限制拆分出的字符串数量  |


```
Map<String,String> splitMap = Splitter.on("&").withKeyValueSeparator("=").split("id=1&name=jack");
System.out.println(Splitter.on('|').trimResults().split("foo|bar ||baz "));
Lists.newArrayList(Splitter.on('|').split("foo|bar ||baz "));
```
**字符串工具类[Strings]**

```
//向右填充x
System.out.println(Strings.padEnd("12345", 10, 'x'));
//向左填充x
System.out.println(Strings.padStart("12345", 10, 'x'));
//判断字符串是否为空
System.out.println(Strings.isNullOrEmpty(null));
//生成重复字符串
System.out.println(Strings.repeat("123", 3));
//获取左边公共字符串
System.out.println(Strings.commonPrefix("abc123", "abc456"));
//获取右边公共字符串
System.out.println(Strings.commonSuffix("123abc", "456abc"));
```
**字符匹配器[CharMatcher]**

```
//移除control字符
String noControl = CharMatcher.JAVA_ISO_CONTROL.removeFrom(string);
//只保留数字字符
String theDigits = CharMatcher.DIGIT.retainFrom(string);
//去除两端的空格，并把中间的连续空格替换成单个空格
String spaced = CharMatcher.WHITESPACE.trimAndCollapseFrom(string, ' ');
//用*号替换所有数字
String noDigits = CharMatcher.JAVA_DIGIT.replaceFrom(string, "*");
// 只保留数字和小写字母
String lowerAndDigit = CharMatcher.JAVA_DIGIT.or(CharMatcher.JAVA_LOWER_CASE).retainFrom(string);
```
**大小写格式[CaseFormat]**

CaseFormat被用来方便地在各种ASCII大小写规范间转换字符串——比如，编程语言的命名规范。CaseFormat支持的格式如下： 

| 格式 |  范例 |  
| --------   | :-----  |  
| LOWER_CAMEL      | 	lowerCamel       |  
| LOWER_HYPHEN     | 	lower-hyphen     |  
| LOWER_UNDERSCORE | 	lower_underscore |  
| UPPER_CAMEL      | 	UpperCamel       |  
| UPPER_UNDERSCORE | 	UPPER_UNDERSCORE |  

CaseFormat的用法很直接：

```
CaseFormat.UPPER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, "CONSTANT_NAME")); // returns "constantName"
```
我们CaseFormat在某些时候尤其有用，比如编写代码生成器的时候。


### 反射
Guava 的 Java 反射机制工具类

```
//类型工具TypeToken
//获取原始类
TypeToken<String> stringTok = TypeToken.of(String.class);
TypeToken<Integer> intTok = TypeToken.of(Integer.class);
//获取泛型类
TypeToken<List<String>> stringListTok = new TypeToken<List<String>>() {};
//获取通配符类型
TypeToken<Map<?, ?>> wildMapTok = new TypeToken<Map<?, ?>>() {};
stringTok.getType();//获得类型
stringListTok.getRawType();//获得运行时类型
stringListTok.getTypes();//获取所有的超类和接口及自身类，可以使用classes()和interfaces()方法允许你只浏览超类和接口类
stringListTok.isArray();//检查类是否为接口
//通过已经给泛型赋值的类来解析原有类型使用这种泛型后其方法返回的应有类型
TypeToken<Map<String, Integer>> mapToken = new TypeToken<Map<String, Integer>>() {};
TypeToken<?> entrySetToken = mapToken.resolveType(Map.class.getMethod("entrySet").getReturnType());
//将会返回TypeToken<Set<Map.Entry<String, Integer>>>
//Guava提供Invokable封装Method和Constructor
Invokable<List<String>, ?> invokable = new TypeToken<List<String>>(){}.method(List.class.getMethod("size"));
invokable.getReturnType(); // int
invokable.isPublic();//判断方法是否是public
invokable.isOverridable();//是否能被重写
invokable.getParameters().get(0).isAnnotationPresent(Nullable.class);//方法的第一个参数是否被定义了注解@Nullable

//包括提供了invoke方法放入实例和参数直接执行
class MyInvocationHandler extends AbstractInvocationHandler {
    @Override
    protected Object handleInvocation(Object o, Method method, Object[] objects) throws Throwable {
        //加入前后处理方法
        return method.invoke(o,objects);
    }
}
//初始化类
Reflection.initialize(Foo.class);
//提供动态代理
Foo foo = Reflection.newProxy(Foo.class, new MyInvocationHandler());
//ClassPath类路径扫描工具 注意：所以不要将它用于关键任务生产任务
ClassPath classpath = ClassPath.from(Map.class.getClassLoader());//通过classLoader获取
//通过直接指定包路径来扫
for (ClassPath.ClassInfo classInfo : classpath.getTopLevelClasses("com.it.mypackage")) {
    classInfo.getName();//获得路径名
}
```
### I/O

```
String path = "C:/Users/Administrator/Desktop/";
File from = new File(path + "from.txt");
File to = new File(path + "to.txt");

//读文件（按行读取）
List<String> lines = Files.readLines(from, Charsets.UTF_8);
//读文件（全部内容）
String content = Files.asCharSource(from, Charsets.UTF_8).read();
//读文件（只读第一行）
String firstLine = Files.asCharSource(from, Charsets.UTF_8).readFirstLine();
//按行读取文件，传入回调函数，控制结束位置和返回内容
String readLines = Files.asCharSource(from, Charset.defaultCharset()).readLines(new LineProcessor<String>() {
	public boolean processLine(String line) throws IOException {
		System.out.println("processing : " + line);
		//返回false则中断读取操作
		return true;
	}
	public String getResult() {
		//所有行处理完后返回的结果
		return "done";
	}
});

//写文件（使用ByteSink，覆盖原有内容）
Files.write("文件内容".getBytes(), from);
//写文件（使用CharSink重写）
Files.asCharSink(from, Charsets.UTF_8).write("使用CharSink重写文件");
//写文件（使用CharSink追加）
Files.asCharSink(from, Charsets.UTF_8, FileWriteMode.APPEND).write("\n使用CharSink追加内容");

//比较文件内容是否一致
Files.equal(from, to);
//复制文件
Files.copy(from, to);
//java NIO复制文件
java.nio.file.Files.copy(Paths.get(fromPath), Paths.get(toPath), StandardCopyOption.REPLACE_EXISTING);
//移动文件（重命名）
Files.move(from, to);
//从url拷贝内容到文件
Resources.asByteSource(new URL("https://www.baidu.com")).copyTo(Files.asByteSink(to));
//计算文件hashcode (可对比两个文件是否一样)
HashCode hashFrom = Files.asByteSource(from).hash(Hashing.sha256());
HashCode hashTo = Files.asByteSource(to).hash(Hashing.sha256());
//获取path下子目录
Files.fileTraverser().breadthFirst(new File(path));
```
