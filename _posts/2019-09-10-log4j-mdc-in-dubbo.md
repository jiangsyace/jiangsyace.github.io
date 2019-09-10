---
title: Dubbo中使用Log4j MDC机制实现日志链路追踪
date: 2019-9-10
categories:
- tech
tags:
- java
- dubbo
---

在分布式环境下，日志用Elasticsearch，Logstash和Kibana(ELK)集中管理，如果没有一个查询整条业务日志链路的方法，定位问题也很麻烦。经过一番研究，选择了一个对线上环境影响最小的改动。

<!-- more -->

MDC ( Mapped Diagnostic Contexts )，它是一个线程安全的存放诊断日志的容器。我们可以使用MDC机制，在处理请求前将请求的唯一标示放到MDC容器中如traceId，这个唯一标示会随着日志一起输出，以此来区分该条日志是属于那个请求的。并在请求处理完成之后清除MDC容器。  
NDC和MDC都是log4j用于存储应用程序的上下文信息（context infomation），从而便于在log中使用这些上下文信息。  
+ NDC采用了一个类似栈的机制来push存储上下文信息，每一个线程都独立地储存上下文信息。比如说一个servlet就可以针对每一个request创建对应的NDC，储存客户端地址等等信息。在相应的PatternLayout中使用`%X`来输出存储的上下文信息
+ MDC内部使用了类似map的机制来存储信息。在配置PatternLayout的时候使用`%X{key}`来输出对应的value

## 解决方案

由于大部分业务逻辑都写在Dubbo服务提供端，所以这里只记录服务提供端的日志链路，消费端只生成并打印一个初始的TRACE_ID，传递给服务提供方，然后
**在业务日志中打印TRACE_ID，整个服务链调用过程全部打印同样的TRACE_ID**，这样，只要根据其中一条日志的TRACE_ID，就能在Kibana中找到整个业务执行过程的日志了。

实现过程主要分三步：  
1. 服务消费端调用服务之前生成TRACE_ID，然后使用Dubbo的RpcContext将TRACE_ID传递给服务提供端
2. 服务提供端在执行具体的业务方法之前，将收到的TRACE_ID存到Log4j/Slf4j的[MDC](http://www.slf4j.org/api/org/slf4j/MDC.html)容器中
3. 修改打印日志格式，打印MDC容器中的TRACE_ID

## 实现过程

### 生成并传递TRACE_ID

+ 消费端创建Filter，调用服务之前生成TRACE_ID  

```
public class TraceConsumerFilter implements Filter {

    private static Logger logger = LoggerFactory.getLogger(TraceConsumerFilter.class);

    @Override
    public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
        //保存在当前请求作用域中，保证同一请求中多次调用服务，trace_id是一样的
        String traceId = (String)RequestContextHolder.getRequestAttributes().getAttribute(Consts.TRACE_LOG_ID, RequestAttributes.SCOPE_REQUEST);
        if (StringUtils.isBlank(traceId)) {
            traceId = Utils.genID();
            RequestContextHolder.getRequestAttributes().setAttribute(Consts.TRACE_LOG_ID, traceId, RequestAttributes.SCOPE_REQUEST);
        }
        RpcContext.getContext().setAttachment(Consts.TRACE_LOG_ID, traceId);
        //下面这种方式传值也可以
        //invocation.getAttachments().put(Consts.TRACE_LOG_ID, traceId);
        logger.info("====>" + invocation.getInvoker().getInterface().getName() + " - " + invocation.getMethodName() + " traceId:" + traceId);

        //执行接口调用逻辑
        Result result = invoker.invoke(invocation);
        return result;
    }
}
```

+ 在`src/main/resources/META-INF/dubbo/com.alibaba.dubbo.rpc.Filter`文件中加入：  
```
traceConsumerFilter=com.jiangsy.web.filter.TraceConsumerFilter
```

> 注意Dubbo版本，包名可能不一样，Dubbo2.7 以后包名由`com.alibaba.dubbo` 更换为 `org.apache.dubbo`

+ 在`spring-dubbo-consumer.xml`文件中配置Filter：  

```
<!-- 消费方调用过程拦截，可用逗号连接多个 -->
<dubbo:reference filter="traceConsumerFilter,xxxFilter" />
<!-- 消费方调用过程缺省拦截器，将拦截所有reference -->
<dubbo:consumer filter="traceConsumerFilter,xxxFilter"/>
```

完成以上配置之后，在每次调用服务之前，过滤器会将trace_id传递给服务提供方，接下来要在服务提供方接收trace_id并打印日志。

### 接收TRACE_ID

+ 服务提供端创建Filter，接收TRACE_ID  

```
public class TraceProviderFilter implements Filter {

    private static Logger logger = LoggerFactory.getLogger(TraceProviderFilter.class);

    @Override
    public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
        // 1. 使用dubbo的RpcContext传递TRACE_ID
        String traceId = RpcContext.getContext().getAttachment(Consts.TRACE_LOG_ID);
        //String traceId = invocation.getAttachments().get(Consts.TRACE_LOG_ID);
        if (StringUtils.isBlank(traceId)) {
            //没有传递则新生成一个traceId
            traceId = Utils.genID();
        }
        // 2. 使用log4j的MDC机制传递TRACE_ID
        MDC.put(Consts.TRACE_LOG_ID, traceId);

        logger.info("====>" + invocation.getInvoker().getInterface().getName() + " - " + invocation.getMethodName() + " traceId:" + traceId);

        //执行接口调用逻辑
        Result result = invoker.invoke(invocation);

        //执行完成移除TRACE_ID
        MDC.remove(Consts.TRACE_LOG_ID);
        return result;
    }
}
```

+ 在`src/main/resources/META-INF/dubbo/com.alibaba.dubbo.rpc.Filter`文件中加入：  
```
traceProviderFilter=com.jiangsy.service.filter.TraceProviderFilter
```

+ 在`spring-dubbo-provider.xml`文件中配置Filter：  

```
<!-- 提供方调用过程拦截，可用逗号连接多个 -->
<dubbo:service filter="traceProviderFilter,yyyFilter" />
<!-- 提供方调用过程缺省拦截器，将拦截所有service -->
<dubbo:provider filter="traceProviderFilter,yyyFilter"/>
```

### 打印TRACE_ID

修改log4j.properties文件，在pattern中使用`%X{TRACE_LOG_ID}`来读取变量：  
```
log4j.appender.LogFile.layout.ConversionPattern=%d %5p [%t] [trace_id_%X{TRACE_LOG_ID}] (%F:%L) - %m%n 
```

可能会出现的异常：`nested exception is java.lang.IllegalStateException: No such extension traceProviderFilter for filter/com.alibaba.dubbo.rpc.Filter`  
检查maven编译时有没有把META-INF文件夹打包放到target/classes目录下，如果没有则修改pom.xml文件：
```
<build>
    <resources>
        <resource>
            <targetPath>${project.build.directory}/classes/META-INF/dubbo</targetPath>
            <directory>src/main/resources/META-INF/dubbo</directory>
            <filtering>true</filtering>
            <includes>
                <include>**/**</include>
            </includes>
        </resource>
    </resources>
</build>
```

## 扩展

+ 可以对traceId设置特定前缀来标识不同业务。
+ 在消费端也可以用traceId标记日志链路，用ThreadLocal来存储traceId，然后在调用服务时传递过去。
+ 线程池ThreadPool问题需要注意：父线程MDC内容要传递给子线程

## 参考

[http://dubbo.apache.org/zh-cn/docs/dev/impls/filter.html](http://dubbo.apache.org/zh-cn/docs/dev/impls/filter.html)