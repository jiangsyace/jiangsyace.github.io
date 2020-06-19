---
title: Spring Boot中方法间调用的事务传播
date: 2020-04-30
categories:
- tech
tags:
- java
- spring
---

众所周知，Spring有七种事务传播机制，它们是通过AOP的方式来实现的，代理在调用原对象方法前开启事务，调用完成之后提交事务，但是如果同一个类中的方法间调用，就不会通过代理了，而是原对象直接调用方法，这时候没有通过代理就不会传播事务，方法上的`@Transactional`注解会失去作用。

<!-- more -->

## 场景
```
@Sevice
public class Test {

  public void a(){
    b();
  }

  @Transactional
  public void b(){
    System.out.print("b");
  }
}
```
此时b方法的事务是不生效的

## 原因

`@Transactional`声明式事务是通过AOP代理来控制的，本类的非事务方法调用带有事务的方法，事务不会生效。

## 解决办法

### 解决方式1：让方法间调用通过代理。
1. 把另外一个方法放到其他类中  
2. 本类中通过ApplicationContext获取bean再调用方法  
  ```java
    @Autowired
    ApplicationContext applicationContext;
    applicationContext.getBean("test")).b();
  ``` 
3. 注入自身Bean，调用自身Bean的方法来实现AOP代理操作  
  ```java
    @Sevice
    public class Test {
      @Autowired
      @Lazy
      private Test test;
      public void a(){
          test.b();
      }
      @Transactional
      public void b(){
        System.out.print("b");
      }
    }
  ```  
4. 使用`@EnableAspectJAutoProxy`注解，通过AopContext获取当前类的代理类  
  ```
    @Sevice
    @EnableAspectJAutoProxy(proxyTargetClass = true, exposeProxy = true)
    public class Test {
      public void a(){
        // 通过代理方式调用方法
        ((Test)AopContext.currentProxy()).b();
        // b();
      }
      @Transactional
      public void b(){
        System.out.print("b");
      }
    }
  ```

### 解决方式2：使用编程式事务

```
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

//注入事务管理器对象：
@Autowired
private PlatformTransactionManager txManager;

//开启事务：
TransactionStatus status = txManager.getTransaction(new DefaultTransactionDefinition());

//提交：
txManager.commit(status);

//回滚：
txManager.rollback(status);
```