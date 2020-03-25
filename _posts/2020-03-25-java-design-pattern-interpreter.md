---
title: Java设计模式——解释器模式
date: 2020-03-25
categories:
- tech
tags:
- java
- design pattern
---


解释器模式（Interpreter）是一种行为型的设计模式，它的定义是：给定一种语言，定义它的文法的一种表示，并定义一个解释器，该解释器使用该表示来解释语言中句子。

<!-- more -->

解释器模式中涉及到了如下几种角色：
+ 抽象表达式角色（Expression）：声明一个所有的具体表达式角色都需要实现的抽象接口。这个接口主要是一个interpret()方法，称做解释操作。
+ 终结符表达式角色（Terminal Expression）：实现了抽象表达式角色所要求的接口，主要是一个interpret()方法；文法中的每一个终结符都有一个具体终结表达式与之相对应。比如有一个简单的公式R=R1+R2，在里面R1和R2就是终结符，对应的解析R1和R2的解释器就是终结符表达式。
+ 非终结符表达式角色（Nonterminal Expression）：文法中的每一条规则都需要一个具体的非终结符表达式，非终结符表达式一般是文法中的运算符或者其他关键字，比如公式`R=R1+R2`中，“+"就是非终结符，解析“+”的解释器就是一个非终结符表达式。
+ 环境角色（Context）：这个角色的任务一般是用来存放文法中各个终结符所对应的具体值，比如`R=R1+R2`，我们给R1赋值100，给R2赋值200。这些信息需要存放到环境角色中，很多情况下我们使用Map来充当环境角色就足够了。 

它的类图结构如下：

![](/assets/upload/2020-03/1585119223.png)

## 解释器模式的实现

环境角色
```
public class Context {
    private String input;
    private String output;

    public void setInput(String input) {
        this.input = input;
    }

    public String getInput() {
        return this.input;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public String getOutput() {
        return this.output;
    }
}
```

抽象表达式角色
```
public abstract class Expression {
    //每个表达式必须有一个解析任务
    public abstract void interpreter(Context ctx);
}
```

非终结符表达式角色
```
public class NonterminalExpression extends Expression {
    private Expression[] expressions;

    //每个非终结符表达式都会对其他表达式产生依赖
    public NonterminalExpression(Expression... expression){
        this.expressions = expression;
    }
    
    public void interpreter(Context ctx) {
        ctx.setOutput("终端" + ctx.getInput());
        //处理表达式
        System.out.println(ctx.getInput() + "经过终端解释器解释为：" + ctx.getOutput());
    }
}
```

终结符表达式角色
```
public class TerminalExpression extends Expression {
    //通常终结符表达式只有一个，但是有多个对象
    public void interpreter(Context ctx) {
        ctx.setOutput("终端" + ctx.getInput());
        System.out.println(ctx.getInput() + "经过终端解释器解释为：" + ctx.getOutput());
    }
}
```

```
public class Client {
    public static void main(String[] args) {
        Context ctx = new Context();
        ctx.setInput("ABC");

        Expression expression1 = new NonterminalExpression();
        expression1.interpreter(ctx);

        Expression expression2 = new TerminalExpression();
        expression2.interpreter(ctx);
    }
}
```

## 解释器模式的适用场景 

+ 重复发生的问题可以使用解释器模式：例如，多个应用服务器，每天产生大量的日志，需要对日志文件进行分析处理，由于各个服务器的日志格式不同，但是数据要素是相同的，按照解释器的说法就是终结符表达式都是相同的，但是非终结符表达式就需要制定了。在这种情况下，可以通过程序来一劳永逸地解决该问题。
+ 尽量不要在重要的模块中使用解释器模式，否则维护会是一个很大的问题。在项目中可以使用shell、JRuby、Groovy等脚本语言来代替解释器模式，弥补Java编译型语言的不足。

## 解释器模式的优缺点

+ 优点：
	+ 扩展性，修改语法规则只要修改相应的非终结符表达式就可以了，若扩展语法，则只要增加非终结符类就可以了。

+ 缺点：
	+ 类膨胀，每个语法都要产生一个非终结符表达式，语法规则比较复杂时，就可能产生大量的类文件，为维护带来了非常多的麻烦。
