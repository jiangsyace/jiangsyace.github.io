---
title: Java8-Lambda表达式
date: 2019-7-17
categories:
- tech
tags:
- java
---

Java8新增了非常多的新特性，其中部分特性在开发过程中很有用，比如Lambda表达式。

<!-- more -->

## 什么是Lambda表达式？

lambda 是为了解决在行为参数化模式下产生的大量重复的代码。可以把lambda表达式理解为简洁地表示可传递的匿名函数的一种方式：它没有名称，但它有参数列表、函数主体、返回类型，可能还有一个可以抛出的异常列表
> 行为参数化，就是一个方法接受多个不同的行为作为参数，并在内部使用它们，完成不同行为的能力。
> 行为参数化可让代码更好地适应不断变化的要求，减轻未来的工作量。

Lambda 的基本语法是 
`(parameters) -> expression`
或者
`(parameters) -> { statements; }`

Lambda使用实例：

| 布尔表达式       | (List<String> list) -> list.isEmpty()    |
| --------------- | ---------------------------------------- |
| 创建对象         | () -> new Apple(10)                      |
| 消费一个对象      | (Apple a) -> {      System.out.println(a.getWeight()); } |
| 从一个对象中选择/抽取 | (String s) -> s.length()                 |
| 组合两个值       | (int a, int b) -> a * b                  |
| 比较两个对象      | (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight()) |


## **什么情况下可使用lambda表达式？**

你可以在函数式接口上使用Lambda表达式。  

### 函数式接口

一言以蔽之，函数式接口就是只定义一个抽象方法的接口。比如Comparator和Runnable。 

```
java.util.Comparator
public interface Comparator<T> { int compare(T o1, T o2);  } 
 
java.lang.Runnable
public interface Runnable{ void run(); } 

java.util.concurrent.Callable
public interface Callable<V>{ V call(); } 
```
> 接口现在还可以拥有默认方法（即在类没有对方法进行实现时，其主体为方法提供默认实现的方法）。哪怕有很多默认方法，只要接口只定义了一个抽象方法，它就仍然是一个函数式接口。

用函数式接口可以干什么呢？Lambda表达式允许你直接以内联的形式为函数式接口的抽象方法提供实现，并把整个表达式作为函数式接口的实例。你用匿名内部类也可以完成同样的事情，只不过比较笨拙：需要提供一个实现，然后再直接内联将它实例化。下面的代码是有效的，因为Runnable是一个只定义了一个抽象方法`run`的函数式接口：

```
Runnable r1 = () -> System.out.println("Hello World 1");  

Runnable r2 = new Runnable(){
    public void run(){
        System.out.println("Hello World 2");
    }
}; 
 
public static void process(Runnable r){     
    r.run(); 
} 
process(r1);
process(r2);
process(() -> System.out.println("Hello World 3"));  
```

### 函数描述符

函数式接口的抽象方法的签名基本上就是Lambda表达式的签名。我们将这种抽象方法叫作`函数描述符`。例如，Runnable接口只有一个叫作`run`的抽象方法，这个方法什么也不接受，什么也不返回（void），这种签名可以表示为 `() -> void`，这个签名在Lambda表达式中可以代表所有参数列表为空，且返回void的函数。

下面两个方法可以传递一样的Lambda表达式，因为他们的签名是一样的，都是`() -> void`，但是他们代表着不同的函数式接口

```
process(() -> System.out.println("Hello World"));
print(() -> System.out.println("Hello World"));

public static void process(Runnable r){     
    r.run(); 
} 

public static void print(Printer p){     
    p.print(); 
}

public interface Printer{
    void print();
}

```

## 使用函数式接口

Java 8在java.util.function包中引入了几个新的函数式接口。如果签名符合我们的需求，可以直接使用。

### Predicate

java.util.function.Predicate<T>接口定义了一个名叫test的抽象方法，它接受泛型`T`对象，并返回一个boolean。在你需要表示一个涉及类型T的布尔表达式时，就可以使用这个接口。比如，你可以定义一个接受String对象的Lambda表达式，如下所示。 

```
@FunctionalInterface 
public interface Predicate<T>{     
    boolean test(T t); 
} 
 
public static <T> List<T> filter(List<T> list, Predicate<T> p) {     
    List<T> results = new ArrayList<>();     
    for(T s: list){         
        if(p.test(s)){            
           results.add(s);         
        }     
    }    
    return results; 
} 
 
Predicate<String> nonEmptyStringPredicate = (String s) -> !s.isEmpty(); 
List<String> nonEmpty = filter(listOfStrings, nonEmptyStringPredicate); 
```

### Consumer

java.util.function.Consumer<T>定义了一个名叫accept的抽象方法，它接受泛型`T`的对象，没有返回（void）。如果需要访问类型T的对象，并对其执行某些操作，就可以使用这个接口。比如，创建一个forEach方法，接受一个Integers的列表，并配合Lambda来打印列表中的所有元素。 

```
@FunctionalInterface 
public interface Consumer<T>{     
    void accept(T t); 
} 
public static <T> void forEach(List<T> list, Consumer<T> c){
    for(T i: list){         
        c.accept(i);     
    } 
}
forEach( Arrays.asList(1,2,3,4,5),  (Integer i) -> System.out.println(i) );
```

### Function

java.util.function.Function<T, R>接口定义了一个叫作apply的方法，它接受一个泛型`T`的对象，并返回一个泛型R的对象。如果需要定将输入对象的信息映射到输出，就可以使用这个接口（比如提取苹果的重量，或把字符串映射为它的长度）。

```
@FunctionalInterface 
public interface Function<T, R>{     
    R apply(T t); 
} 
public static <T, R> List<R> map(List<T> list, Function<T, R> f) {     
    List<R> result = new ArrayList<>();     
    for(T s: list){         
        result.add(f.apply(s));     
    }    
    return result; 
} 
// [7, 2, 6] 
List<Integer> l = map(Arrays.asList("lambdas","in","action"), (String s) -> s.length() ); 
```

### 原始类型特化 

除了以上三个泛型函数式接口，还有些函数式接口专为某些类型而设计，以便在输入和输出都是原始类型时避免自动装箱的操作。要知道，自动装箱在性能方面是要付出代价的，装箱后的值本质上就是把原始类型包裹起来，并保存在堆里。因此，装箱后的值需要更多的内存，并需要额外的内存搜索来获取被包裹的原始值。

Java 8中的提供的常用函数式接口 ：

| 函数式接口         | 函数描述符      | 原始类型特化                              |
| ----------------- | -------------- | ---------------------------------------- |
| Predicate<T>      | T->boolean     | IntPredicate,LongPredicate, DoublePredicate |
| Consumer<T>       | T->void        | IntConsumer,LongConsumer, DoubleConsumer |
| Function<T,R>     | T->R           | IntFunction<R>, IntToDoubleFunction, IntToLongFunction, LongFunction<R>, LongToDoubleFunction, LongToIntFunction, DoubleFunction<R>, ToIntFunction<T>, ToDoubleFunction<T>,  ToLongFunction<T> |
| Supplier<T>       | ()->T          | BooleanSupplier,IntSupplier, LongSupplier, DoubleSupplier |
| UnaryOperator<T>  | T->T           | IntUnaryOperator, LongUnaryOperator, DoubleUnaryOperator |
| BinaryOperator<T> | (T,T)->T       | IntBinaryOperator, LongBinaryOperator, DoubleBinaryOperator |
| BiPredicate<L,R>  | (L,R)->boolean |                                          |
| BiConsumer<T,U>   | (T,U)->void    | ObjIntConsumer<T>, ObjLongConsumer<T>, ObjDoubleConsumer<T> |
| BiFunction<T,U,R> | (T,U)->R       | ToIntBiFunction<T,U>, ToLongBiFunction<T,U>, ToDoubleBiFunction<T,U> |


## 类型检查、类型推断以及限制

当我们提到Lambda表达式时，说它可以为函数式接口生成一个实例。然而，Lambda 表达式本身并不包含它在实现哪个函数式接口的信息。为了全面了解Lambda表达式，我们应该要知道Lambda的实际类型是什么。 

### 类型检查

Lambda的类型是从使用Lambda的上下文推断出来的。上下文（比如，接受它传递的方法的 参数，或接受它的值的局部变量）中Lambda表达式需要的类型称为目标类型。我们可以通过通过一个例子，来看看Lambda表达式是如何进行类型检查的。

这里应该有个图？？

### 类型推断 

Java编译器会从上下文（目标类型）推断出用什么函数式接口来配合Lambda表达式，这意味着它也可以推断出适合Lambda的签名，因为函数描述符可以通过目标类型来得到。这样做的好处在于，编译器可以了解Lambda表达式的参数类型，这样就可以在Lambda语法中省去标注参数类型。换句话说，Java编译器会像下面这样推断Lambda的参数类型：
```
List<Apple> greenApples = filter(inventory, (Apple a) -> "green".equals(a.getColor())); 

List<Apple> greenApples = filter(inventory, a -> "green".equals(a.getColor())); 
```
参数a不用指定类型，而且当Lambda仅有一个类型需要推断的参数时，参数名称两边的括号也可以省略。 

### 使用局部变量 

Lambda表达式可以引用类成员和局部变量（会将这些变量隐式得转换成final的），例如下列两个代码块的效果完全相同：

```
String separator = ",";
Arrays.asList( "a", "b", "d" ).forEach( 
    ( String e ) -> System.out.print( e + separator ) );
```
和
```
final String separator = ",";
Arrays.asList( "a", "b", "d" ).forEach( 
    ( String e ) -> System.out.print( e + separator ) );
```

被隐式转换为final后，不能再更改值，如下面的代码块编译不通过

```
String separator = ",";
Arrays.asList( "a", "b", "d" ).forEach( 
    ( String e ) -> System.out.print( e + separator ) );
separator = ".";
```

## 方法引用

方法引用让你可以重复使用现有的方法定义，并像Lambda一样传递它们。在一些情况下， 比起使用Lambda表达式，它们似乎更易读，感觉也更自然。

下面就是用方法引用写的一个排序的例子：   
先前： 
```
inventory.sort((Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight())); 
```
之后（使用方法引用和java.util.Comparator.comparing）：  
```
inventory.sort(comparing(Apple::getWeight)); 
```

方法引用可以被看作仅仅调用特定方法的Lambda的一种快捷写法。它的基本思想是，如果一个Lambda代表的只是“直接调用这个方法”，那好还是用名称来调用它，而不是去描述如何调用它。事实上，方法引用就是让你根据已有的方法实现来创建Lambda表达式。但是，显式地指明方法的名称，你的代码的可读性会更好。它是如何工作的呢？当你需要使用方法引用时，目标引用放在分隔符::前，方法的名称放在后面。例如，`Apple::getWeight`就是引用了Apple类中定义的方法getWeight。请记住，不需要括号，因为 你没有实际调用这个方法。方法引用就是Lambda表达式`(Apple a) -> a.getWeight()`的快捷写法。

Java 8中Lambda及其等效方法引用的例子：

| Lambda                                   | 等效的方法引用                           |
| ---------------------------------------- | --------------------------------- |
| (Apple a) -> a.getWeight()               | Apple::getWeight                  |
| () -> Thread.currentThread().dumpStack() | Thread.currentThread()::dumpStack |
| (str, i) -> str.substring(i)             | String::substring                 |
| (String s) -> System.out.println(s)      | System.out::println               |

你可以把方法引用看作针对仅仅涉及单一方法的Lambda的语法糖，因为你表达同样的事情时要写的代码更少了。 

**如何构建方法引用？** 
(1) 指向静态方法的方法引用（例如Integer的parseInt方法，写作`Integer::parseInt`）。
(2) 指向任意类型实例方法的方法引用（例如String 的 length 方法，写作 `String::length`）。 
(3) 指向现有对象的实例方法的方法引用（假设你有一个局部变量expensiveTransaction用于存放Transaction类型的对象，它支持实例方法getValue，那么你就可以写`expensive-Transaction::getValue`）。 

### 构造函数引用

除了创建方法引用。我们也可以对类的构造函数做类似的事情。对于一个现有构造函数，你可以利用它的名称和关键字new来创建它的一个引用：`ClassName::new`。它的功能与指向静态方法的引用类似。  
例如，假设有一个构造函数没有参数。 它适合Supplier的签名`() -> Apple`。你可以这样做： 

```
Supplier<Apple> c1 = Apple::new;
//调用Supplier的get方法，将产生一个新的Apple 
Apple a1 = c1.get(); 
```

这就等价于： 

```
Supplier<Apple> c1 = () -> new Apple();
Apple a1 = c1.get(); 
```

如果你的构造函数的签名是`Apple(Integer weight)`，那么它就适合Function接口的签名，于是你可以这样写： 
```
Function<Integer, Apple> c2 = Apple::new; 
//调用Function函数的apply方法，并给出要求的重量，将产生一个Apple
Apple a2 = c2.apply(110);  
```
这就等价于： 
```
Function<Integer, Apple> c2 = (weight) -> new Apple(weight);
Apple a2 = c2.apply(110); 
```

如果你有一个具有两个参数的构造函数`Apple(String color, Integer weight)`，那么 它就适合BiFunction接口的签名，于是你可以这样写： 
```
BiFunction<String, Integer, Apple> c3 = Apple::new;   
Apple c3 = c3.apply("green", 110); 
```
这就等价于： 
```
BiFunction<String, Integer, Apple> c3 = (color, weight) -> new Apple(color, weight);  
Apple c3 = c3.apply("green", 110);  
```

不将构造函数实例化却能够引用它，这个功能有一些有趣的应用。
例如，你可以使用Map来将构造函数映射到字符串值。你可以创建一个giveMeFruit方法，给它一个String和一个 Integer，它就可以创建出不同重量的各种水果： 
```
static Map<String, Function<Integer, Fruit>> map = new HashMap<>();
static {    
    map.put("apple", Apple::new);   
    map.put("orange", Orange::new);
} 
public static Fruit giveMeFruit(String fruit, Integer weight){     
    return map.get(fruit.toLowerCase()).apply(weight);
}
```

## 复合Lambda表达式

Java 8的好几个函数式接口都有为方便而设计的方法。具体而言，许多函数式接口，比如用于传递Lambda表达式的Comparator、Function和Predicate都提供了允许你进行复合的方法。就是把多个简单的Lambda复合成复杂的表达式。比如，你可以让两个谓词之间做一个or操作，组合成一个更大的谓词。而且，你还可以让一个函数的结果成为另一个函数的输入。你可能会想，函数式接口中怎么可能有更多的方法呢？（毕竟，这违背了函数式接口的定义啊！）窍门在于，我们即将介绍的方法都是默认方法，也就是说它们不是抽象方法。

### 比较器复合

我们前面看到，你可以使用静态方法Comparator.comparing，根据提取用于比较的键值的Function来返回一个Comparator，如下所示： 
```
Comparator<Apple> c = Comparator.comparing(Apple::getWeight); 
```
1. 逆序  
   如果你想要对苹果按重量递减排序怎么办？用不着去建立另一个Comparator的实例。接口有一个默认方法reversed可以使给定的比较器逆序。因此仍然用开始的那个比较器，只要修改一下前一个例子就可以对苹果按重量递减排序： 
```
inventory.sort(comparing(Apple::getWeight).reversed()); 
```
2. 比较器链  
   上面说得都很好，但如果发现有两个苹果一样重怎么办？哪个苹果应该排在前面呢？你可能 需要再提供一个Comparator来进一步定义这个比较。比如，在按重量比较两个苹果之后，你可能想要按原产国排序。thenComparing方法就是做这个用的。它接受一个函数作为参数（就像comparing方法一样），如果两个对象用第一个Comparator比较之后是一样的，就提供第二个Comparator。你又可以优雅地解决这个问题了： 
```
inventory.sort(comparing(Apple::getWeight)
        .reversed() //按重量递减排序
        .thenComparing(Apple::getCountry)); //两个苹果一样重时，进一步按原产国排序
```

### 谓词复合

谓词接口包括三个方法：negate、and和or，让你可以重用已有的Predicate来创建更复杂的谓词。比如，你可以使用negate方法来返回一个Predicate的非，比如苹果不是红的：  
```
Predicate<Apple> notRedApple = redApple.negate(); 
```
你可能想要把两个Lambda用and方法组合起来，比如一个苹果既是红色又比较重：  
```
Predicate<Apple> redAndHeavyApple = redApple.and(a -> a.getWeight() > 150);  
```
你可以进一步组合谓词，表达要么是重（150克以上）的红苹果，要么是绿苹果：  
```
Predicate<Apple> redAndHeavyAppleOrGreen = redApple.and(a -> a.getWeight() > 150).or(a -> "green".equals(a.getColor())); 
```
请注意，and和or方法是按照在表达式链中的位置，从左向右确定优先级的。因此，a.or(b).and(c)可以看作(a || b) && c。 

### 函数复合

你还可以把Function接口所代表的Lambda表达式复合起来。Function接口为此配了andThen和compose两个默认方法，它们都会返回Function的一个实例。 andThen方法会返回一个函数，它先对输入应用一个给定函数，再对输出应用另一个函数。比如，假设有一个函数f给数字加1 `(x -> x + 1)`，另一个函数g给数字乘2，你可以将它们组合成一个函数h，先给数字加1，再给结果乘2： 
```
Function<Integer, Integer> f = x -> x + 1; 
Function<Integer, Integer> g = x -> x * 2; 
Function<Integer, Integer> h = f.andThen(g); 
int result = h.apply(1); // 4
```

你也可以类似地使用compose方法，先把给定的函数用作compose的参数里面给的那个函数，然后再把函数本身用于结果。比如在上一个例子里用compose的话，它将意味着f(g(x))， 而andThen则意味着g(f(x))： 
```
Function<Integer, Integer> f = x -> x + 1; 
Function<Integer, Integer> g = x -> x * 2; 
Function<Integer, Integer> h = f.compose(g);  
int result = h.apply(1); // 3
```

**使用实例：对用String表示的一封信做文本转换**
```
public class Letter{     
    public static String addHeader(String text){         
        return "From Raoul, Mario and Alan: " + text;     
    } 
 
    public static String addFooter(String text){         
        return text + " Kind regards";     
    } 
 
    public static String checkSpelling(String text){         
        return text.replaceAll("labda", "lambda");     
    } 
}
```

现在你可以通过复合这些工具方法来创建各种转型流水线了，比如创建一个流水线：先加上抬头，然后进行拼写检查，后加上一个落款。 
```
Function<String, String> addHeader = Letter::addHeader; 
Function<String, String> transformationPipeline = addHeader.andThen(Letter::checkSpelling).andThen(Letter::addFooter);
```

第二个流水线可能只加抬头、落款，而不做拼写检查： 
```
Function<String, String> addHeader = Letter::addHeader; 
Function<String, String> transformationPipeline = addHeader.andThen(Letter::addFooter); 
```

## 日常使用

```
//list 取属性生成数组
String[] productIds = productList.stream().map(Product::getId).toArray(String[]::new);
//list 取属性生成新list
List<String> productIdList = productList.stream().map(Product::getId).collect(Collectors.toList());
//list转map
Map<String, List<Product>> productMap = productList.stream().collect(Collectors.groupingBy(Product::getId));
//取出list中重复数据
ArrayList<Product> distinctedList = productList.stream()
                .collect(
                        Collectors.collectingAndThen(
                                Collectors.toCollection(() -> new TreeSet<>(Comparator.comparing(Product::getId))),
                                ArrayList::new));
```

