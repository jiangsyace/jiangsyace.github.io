---
title: spring-data-redis使用
categories:
- tech
tags:
- spring
- redis
---

<!-- more -->

## 配置

pom.xml

```
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>2.4.2</version>
</dependency>
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-redis</artifactId>
    <version>1.4.2.RELEASE</version>
</dependency>
```

spring-cache.xml
```
<cache:annotation-driven cache-manager="cacheManager" />
<bean id="cacheManager" class="org.springframework.cache.support.CompositeCacheManager">  
    <property name="cacheManagers">  
        <list>  
<!-- 	    <ref bean="ehcacheManager"/>   -->
            <ref bean="mapCacheManager"/>
            <ref bean="redisCacheManager"/>
        </list>  
    </property>  
    <property name="fallbackToNoOpCache" value="true"/>  
</bean>
<bean id="mapCacheManager" class="org.springframework.cache.concurrent.ConcurrentMapCacheManager">
    <constructor-arg index="0">
        <set>
            <value>Dict</value>
            <value>Config</value>
            <value>staticValueCache</value>
        </set>
    </constructor-arg>
</bean>

<bean id="redisCacheManager" class="org.springframework.data.redis.cache.RedisCacheManager">
   <constructor-arg ref="redisTemplate"/>
<!-- 这里不要用构造方法设置缓存名，因为一旦通过构造方法设置缓存名，会直接创建缓存，跳过设置过期时间,注意：设置properties也分先后顺序 -->
<!-- <constructor-arg index="1"> -->
<!--     <set> -->
<!--         <value>TurnTableQueue</value> -->
<!--         <value>AwardRecord</value> -->
<!--     </set> -->
<!-- </constructor-arg> -->
    <property name="expires">
       <map>
           <entry key="TurnTableQueue" value="60" />
       </map>
   </property>
   <property name="usePrefix" value="true"/>
    <property name="cacheNames">
        <set>
            <value>TurnTableQueue</value>
            <value>TurnTablePresetAward</value>
        </set>
    </property>
</bean>

<bean id="jedisPoolConfig" class="redis.clients.jedis.JedisPoolConfig">
    <property name="maxTotal" value="${redis.maxTotal}"></property>
    <property name="maxIdle" value="${redis.maxIdle}" />     
    <property name="maxWaitMillis" value="${redis.maxWait}" />    
    <property name="testOnBorrow" value="${redis.testOnBorrow}" /> 
</bean>  

<bean id="sentinelConfig" class="org.springframework.data.redis.connection.RedisSentinelConfiguration"> 
    <property name="master">
        <bean class="org.springframework.data.redis.connection.RedisNode">
            <property name="name" value="mymaster"/>
        </bean>
    </property>
    <property name="sentinels">
        <set>
            <bean class="org.springframework.data.redis.connection.RedisNode">
                <constructor-arg name="host" value="${redis.master.host}"/>
                <constructor-arg name="port" value="${redis.master.port}"/>
            </bean>
            <bean class="org.springframework.data.redis.connection.RedisNode">
                <constructor-arg name="host" value="${redis.slave.host}"/>
                <constructor-arg name="port" value="${redis.slave.port}"/>
            </bean>
        </set>
    </property>
</bean>
<bean id="jedisConnectionFactory" class="org.springframework.data.redis.connection.jedis.JedisConnectionFactory">
    <constructor-arg name="sentinelConfig" ref="sentinelConfig" />
    <constructor-arg name="poolConfig" ref="jedisPoolConfig" />
</bean>

<bean id="redisTemplate" class="org.springframework.data.redis.core.RedisTemplate">
    <property name="connectionFactory" ref="jedisConnectionFactory" />
    <property name="keySerializer">
        <bean class="org.springframework.data.redis.serializer.StringRedisSerializer"></bean>
    </property>
    <property name="hashKeySerializer">
        <bean class="org.springframework.data.redis.serializer.StringRedisSerializer"></bean>
    </property>
    <property name="valueSerializer">  
        <bean class="org.springframework.data.redis.serializer.JdkSerializationRedisSerializer"/>  
    </property>  
    <property name="hashValueSerializer">  
        <bean class="org.springframework.data.redis.serializer.JdkSerializationRedisSerializer"/>
    </property>
</bean>
```

## 易错点

### spring-data-redis与Spring的版本不对应

【环境参数】
Redis版本：redis-2.4.5-win32-win64
Spring原来的版本：4.1.7.RELEASE
Spring修改后的版本：4.2.6.RELEASE

【障碍描述】
Question：NoSuchMethodError
Invocation of init method failed; nested exception is java.lang.NoSuchMethodError:
org.springframework.core.serializer.support.DeserializingConverter.<init>(Ljava/lang/ClassLoader;)V

【解决步骤】
进入spring-data-redis的pom文件查看依赖的spring版本是否与正在使用的spring版本一样，不一样则相应修改spring-data-redis的版本

【原因分析】
原因：Spring的版本过低
在SDR的官网中，有如下一段描述：
Spring Data Redis 1.x binaries requires JDK level 6.0 and above, and Spring Framework 4.2.6.RELEASE and above.

【参考链接】
http://docs.spring.io/spring-data/redis/docs/1.7.2.RELEASE/reference/html/



