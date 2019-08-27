---
title: Java8-Stream API
date: 2019-8-6
categories:
- tech
tags:
- java
---

Stream 的背景，以及 Java 8 中的使用总结

<!-- more -->

## 什么是Stream（流）

Stream是数据渠道，用于操作数据源（集合，数组等）所生成的元素序列。  
Stream 就如同一个迭代器（Iterator），单向，不可往复，数据只能遍历一次，遍历过一次后即用尽了，就好比流水从面前流过，一去不复返。  
而和迭代器又不同的是，Stream 是在内部迭代的，而且Stream 可以并行化操作，迭代器只能命令式地、串行化操作。而使用并行去遍历时，数据会被分成多个段，其中每一个都在不同的线程中处理，然后将结果一起输出。Stream 的并行操作依赖于 Java7 中引入的 Fork/Join 框架（JSR166y）来拆分任务和加速处理过程。

## 流的构建

###　对象流

```
// 由单个值创建流：Stream.of(T t)
Stream<String> strStream = Stream.of("a", "b", "c");
// 由数组创建流：Arrays.stream(T array) 或 Stream.of(T t)
String[] strArr = new String[] {"a", "b", "c"};
strStream = Stream.of(strArr);
int[] intArr = new int[]{1, 2, 3, 4, 5};
IntStream intStream = Arrays.stream(intArr);
// 由集合创建流：Collection.stream(), Collection.parallelStream()
List<String> list = Arrays.asList(strArr);
strStream = list.stream();

// 由文件生成流
// java.nio.file.Files中的很多静态方法都会返回一个流。比如 Files.lines，它会返回一个由指定文件中的各行构成的字符串流。
// 下面这个例子可以得出一个文件中有多少各不相同的词： 
long uniqueWords = 0;
try (Stream<String> lines = Files.lines(Paths.get("data.txt"), Charset.defaultCharset())) {
  uniqueWords = lines.flatMap(line -> Arrays.stream(line.split(" "))).distinct().count();
} catch (IOException e) {
}

// 由函数生成流：创建无限流
Stream.iterate(0, n -> n + 2).limit(10).forEach(System.out::println);
// 斐波纳契元组序列
Stream.iterate(new int[] { 0, 1 }, t -> new int[] { t[1], t[0] + t[1] }).limit(20)
    .forEach(t -> System.out.println("(" + t[0] + "," + t[1] + ")"));
// 创建随机数
Stream.generate(Math::random).limit(5).forEach(System.out::println);

// 创建一个空流
Stream<String> emptyStream = Stream.empty();

// 其他
Random.ints()
BitSet.stream()
Pattern.splitAsStream(java.lang.CharSequence)
JarFile.stream()
StreamSupport.stream(Spliterator<T> spliterator, boolean parallel)
```

### 数值流
如同Java中内置的函数式接口一样，流也有相应的针对基本数据类型的接口：IntStream、LongStream 和 DoubleStream，它们分别将流中的元素特化为int、long和double，从而避免了暗含的装箱成本。

#### 数值流方法
```
IntStream.of(new int[]{1, 2, 3}).forEach(System.out::println);
IntStream.range(1, 3).forEach(System.out::println);
IntStream.rangeClosed(1, 3).forEach(System.out::println);
personList.stream().mapToInt(Person::getAge);

```

#### 映射到数值流

+ mapToInt(T -> int) : return IntStream
+ mapToDouble(T -> double) : return DoubleStream
+ mapToLong(T -> long) : return LongStream

```
IntStream intStream = personList.stream().mapToInt(Person::getAge);
```

#### 转换回对象流
```
// 在需要将数值范围装箱成为一个一般流时，boxed非常有用
Stream<Integer> stream = intStream.boxed(); 
```

## 流的操作

当把一个数据结构包装成 Stream 后，就可以对里面的元素进行各类操作了。常见的操作可以归类如下。

### 中间操作（Intermediate）

一个流可以后面跟随零个或多个 intermediate 操作。其目的主要是打开流，做出某种程度的数据映射/过滤，然后返回一个新的流，交给下一个操作使用。这类操作都是惰性化的（lazy），就是说，仅仅调用到这类方法，并没有真正开始流的遍历。

+ map - 通过一个 Function 把一个元素类型为 T 的流转换成元素类型为 R 的流。
+ flatMap - 通过一个 Function 把一个元素类型为 T 的流中的每个元素转换成一个元素类型为 R 的流，再把这些转换之后的流合并。
+ filter - 过滤流中的元素，只保留满足由 Predicate 所指定的条件的元素。
+ distinct - 使用 equals 方法来删除流中的重复元素。
+ limit - 截断流使其最多只包含指定数量的元素。这是一个短路的操作。
+ skip - 返回一个新的流，并跳过原始流中的前 N 个元素。
+ sorted - 对流进行排序。
+ peek - 返回的流与原始流相同。当原始流中的元素被消费时，会首先调用 peek 方法中指定的 Consumer 实现对元素进行处理。
+ dropWhile - 从原始流起始位置开始删除满足指定 Predicate 的元素，直到遇到第一个不满足 Predicate 的元素。
+ takeWhile - 从原始流起始位置开始保留满足指定 Predicate 的元素，直到遇到第一个不满足 Predicate 的元素。
+ parallel - 返回平行的等效流。可能会返回自己，因为流已经是并行的，或者因为底层流状态被修改为并行。
+ sequential - 返回顺序的等效流。 可能返回自己，因为流已经是顺序的，或者因为底层流状态被修改为顺序的。 
+ unordered - 返回无序的等效流。可能会返回自己，因为流已经无序，或者因为基础流状态被修改为无序。

### 终端操作（Terminal）

一个流只能有一个 terminal 操作，当这个操作执行后，流就被使用“光”了，无法再被操作。所以这必定是流的最后一个操作。Terminal 操作的执行，才会真正开始流的遍历，并且会生成一个结果，或者产生一个副作用（side effect）。

+ forEach - 对流中的每个元素执行一些操作。
+ forEachOrdered - 如果流具有定义的遇到顺序，则以流的遇到顺序对该流的每个元素执行操作。 
+ toArray - 返回一个包含此流的元素的数组。
+ reduce - 通过一个二进制操作将流中的元素合并到一起。
+ collect - 将流中的元素放入某些容器，例如一个Collection或Map.
+ min - 根据一个比较器找到流中元素的最小值。
+ max -根据一个比较器找到流中元素的最大值。
+ count - 计算流中元素的数量。
+ anyMatch - 判断流中是否至少有一个元素匹配断言。这是一个短路的操作。
+ allMatch - 判断流中是否每一个元素都匹配断言。这是一个短路的操作。
+ noneMatch - 判断流中是否没有一个元素匹配断言。这是一个短路的操作。
+ findFirst - 查找流中的第一个元素。这是一个短路的操作。
+ findAny - 查找流中的任意元素，可能对某些流要比findFirst代价低。这是一个短路的操作。

还有一种操作被称为短路操作（Short-circuiting）。用以指：  
+ 对于一个intermediate 操作，如果它接受的是一个无限大（infinite/unbounded）的Stream，但返回一个有限的新Stream。
+ 对于一个 terminal 操作，如果它接受的是一个无限大的 Stream，但能在有限的时间计算出结果。  

当操作一个无限大的 Stream，而又希望在有限时间内完成操作，则在管道内拥有一个 short-circuiting 操作是必要非充分条件。

## 流的使用

简单说，对 Stream 的使用就是实现一个 filter-map-reduce 过程，产生一个最终结果，或者导致一个副作用（side effect），副作用指的是行为参数在执行的时候有进行输入，比如网络输入输出等。  

通常，处理一个流涉及了这些步骤：  
+ 从某个源头获得一个流。
+ 执行一个或更多的中间的操作。
+ 执行一个末端的操作。

### 筛选和切片

Stream接口的filter方法接受一个谓词（predicate）作为参数，并返回一个包括所有符合谓词的元素的流。

```
// 筛选偶数
Integer[] numbers = {1, 2, 2, 3, 4, 5, 6};
Stream.of(numbers).filter(n -> n % 2 == 0).forEach(System.out::println);
// 筛选各异的元素
Stream.of(numbers).filter(n -> n % 2 == 0).distinct().forEach(System.out::println);
// 截短流
Stream.of(numbers).filter(n -> n % 2 == 0).limit(3).forEach(System.out::println);
// 跳过元素
Stream.of(numbers).filter(n -> n % 2 == 0).skip(2).forEach(System.out::println);
```

### 映射流

流支持map方法，它会接受一个函数作为参数。这个函数会被应用到每个元素上，并将其映射成一个新的元素（并不修改原来的元素）。
```
// 对流中每一个元素应用函数
List<String> peopleNames = personList.stream().map(Person::getName).collect(Collectors.toList());

// 流的扁平化,将多个流合并起来，即扁平化为一个流
List<String> uniqueCharacters = words.stream()
                                .map(w -> w.split("")) // 将每个单词转换为由其字母构成的数组 
                                .flatMap(Arrays::stream) // 将各个生成流扁平化为单个流 
                                .distinct().collect(Collectors.toList());
```

### 查找和匹配

```
// 检查谓词是否至少匹配一个元素
boolean isThereAnyChild = persons.stream().anyMatch(p -> p.getAge() < 12);
// 检查谓词是否匹配所有元素 
boolean isAllAdult = personList.stream().allMatch(p -> p.getAge() > 18);
// 查找元素 
Optional<Person> person = personList.stream().filter(p -> p.getAge() > 18).findAny();
// 查找第一个元素 
Optional<Person> person = personList.stream().filter(p -> p.getAge() > 18).findFirst();
```

Optional<T>类（java.util.Optional）是一个容器类，代表一个值存在或不存在。Optional提供了方法可以显示地检查值是否存在。

```
personList.stream().filter(p -> p.getAge() > 18).findAny().ifPresent(p -> System.out.println(p.getName()));
```

> 何时使用findFirst和findAny？   
> 答案是并行。找到第一个元素在并行上限制更多。如果你不关心返回的元素是哪个，请使用findAny，因为它在使用并行流时限制较少。 

### 归约

reduce接受两个参数：  
+ 一个初始值（可选）
+ 一个BinaryOperator<T>来将两个元素结合起来产生一个新值，

```
// 元素求和
int sum = Stream.of(numbers).reduce(0, (a, b) -> a + b);

// 最大值和最小值 
Optional<Integer> max = Stream.of(numbers).reduce(Integer::max);

// 用map和reduce计算流中元素的数量
int count = Stream.of(numbers).map(n -> 1) // 把流中每个元素都映射成数字1
                              .reduce(0, (a, b) -> a + b); // 用reduce求和
// 内置的方法也可以用来计算流中元素的个数
long count = menu.stream().count(); 
```
> map和reduce的连接通常称为map-reduce模式，因Google用它来进行网络搜索而出名，因为它很容易并行化。

### 并行

所有的流操作都可以串行执行或者并行执行。
除非显示地创建并行流，否则Java库中创建的都是串行流。 Collection.stream()为集合创建串行流而Collection.parallelStream()为集合创建并行流。IntStream.range(int, int)创建的是串行流。通过parallel()方法可以将串行流转换成并行流,sequential()方法将流转换成串行流。

除非方法的Javadoc中指明了方法在并行执行的时候结果是不确定(比如findAny、forEach)，否则串行和并行执行的结果应该是一样的。

### Non-interference

流可以从非线程安全的集合中创建，当流的管道执行的时候，非concurrent数据源不应该被改变。下面的代码会抛出java.util.ConcurrentModificationException异常：

```
List<String> l = new ArrayList(Arrays.asList("one", "two"));
Stream<String> sl = l.stream();
sl.forEach(s -> l.add("three"));
```

在设置中间操作的时候，可以更改数据源，只有在执行终点操作的时候，才有可能出现并发问题(抛出异常，或者不期望的结果)，比如下面的代码不会抛出异常：

```
List<String> l = new ArrayList(Arrays.asList("one", "two"));
Stream<String> sl = l.stream();
l.add("three");
sl.forEach(System.out::println);
```

对于concurrent数据源，不会有这样的问题，比如下面的代码很正常：

```
List<String> l = new CopyOnWriteArrayList<>(Arrays.asList("one", "two"));
Stream<String> sl = l.stream();
sl.forEach(s -> l.add("three"));
```

虽然我们上面例子是在终点操作中对非并发数据源进行修改，但是非并发数据源也可能在其它线程中修改，同样会有并发问题。


### 副作用（Side-effects）

有副作用的行为参数是被不鼓励使用的。

副作用指的是行为参数在执行的时候有输入输入，比如网络输入输出等。

这是因为Java不保证这些副作用对其它线程可见，也不保证相同流管道上的同样的元素的不同的操作运行在同一个线程中。

很多有副作用的行为参数可以被转换成无副作用的实现。一般来说println()这样的副作用代码不会有害。

```
ArrayList<String> results = new ArrayList<>();
stream.filter(s -> pattern.matcher(s).matches())
      .forEach(s -> results.add(s));  // 副作用代码
```
上面的代码可以改成无副作用的。

```
List<String>results =
    stream.filter(s -> pattern.matcher(s).matches())
          .collect(Collectors.toList());  // No side-effects!
```

### 排序 Ordering

某些流的返回的元素是有确定顺序的，我们称之为 encounter order。这个顺序是流提供它的元素的顺序，比如数组的encounter order是它的元素的排序顺序，List是它的迭代顺序(iteration order)，对于HashSet,它本身就没有encounter order。

一个流是否是encounter order主要依赖数据源和它的中间操作，比如数据源List和Array上创建的流是有序的(ordered)，但是在HashSet创建的流不是有序的。

sorted()方法可以将流转换成encounter order的，unordered可以将流转换成encounter order的。

注意，这个方法并不是对元素进行排序或者打散，而是返回一个是否encounter order的流。

> https://stackoverflow.com/questions/21350195/stream-ordered-unordered-problems  
> If a stream is ordered, repeated execution of identical stream pipelines on an identical source will produce an identical result; if it is not ordered, repeated execution might produce different results.

除此之外，一个操作可能会影响流的有序,比如map方法，它会用不同的值甚至类型替换流中的元素，所以输入元素的有序性已经变得没有意义了，但是对于filter方法来说，它只是丢弃掉一些值而已，输入元素的有序性还是保障的。

对于串行流，流有序与否不会影响其性能，只是会影响确定性(determinism)，无序流在多次执行的时候结果可能是不一样的。

对于并行流，去掉有序这个约束可能会提供性能，比如distinct、groupingBy这些聚合操作。

### 组合

concat用来连接类型一样的两个流。

```
public static <T> Stream<T> 	concat(Stream<? extends T> a, Stream<? extends T> b)
```

### 转换

toArray方法将一个流转换成数组，而如果想转换成其它集合类型，就需要调用collect方法，利用Collectors.toXXX方法进行转换：

```
public static <T,C extends Collection<T>> Collector<T,?,C> 	toCollection(Supplier<C> collectionFactory)
public static …… 	toConcurrentMap(……)
public static <T> Collector<T,?,List<T>> 	toList()
public static …… 	toMap(……)
public static <T> Collector<T,?,Set<T>> 	toSet()
```


---

## 相关主题

[https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html)

[https://www.ibm.com/developerworks/cn/java/j-lo-java8streamapi/](https://www.ibm.com/developerworks/cn/java/j-lo-java8streamapi/)