---
title: Maven打包并上传到Linux服务器
date: 2019-8-19
categories:
- tech
tags:
- java
---

每次打包部署测试，流程都一样，maven打包，打开文件管理器找到war包，拖到测试服务器，切换到命令行界面，运行部署脚本。每次部署都要做这样重复的步骤，终于有一天，脑子突然开窍，如同被一道雷劈过，脑中浮现一贯奉行的真理：一切重复的操作都是可以通过程序自动完成的。  
maven都能打包上传到nexus仓库，为啥不能上传到测试服务器呢。

<!-- more -->

整理关键字一搜索，发现maven是可以通过一个插件来查看和传输资源的：[wagon-maven-plugin](http://www.mojohaus.org/wagon-maven-plugin/)  

Wagon 插件可以实现以下功能：
+ wagon:upload-single 上传指定文件到远程地址.
+ wagon:upload 上传文件集合到远程地址.
+ wagon:download-single 从远程地址下载指定文件.
+ wagon:download 从远程地址下载文件集合.
+ wagon:list 列出远程存储库中指定位置的内容.
+ wagon:copy 在Wagon仓库下拷贝文件集合到另一个仓库.
+ wagon:merge-maven-repos 合并，包括元数据、Maven存储库到另一个Maven存储库.
+ wagon:sshexec 在远程SSH主机上执行一组命令.

可以通过`wagon:upload-single`或`wagon:upload`来实现上传war包和其他资源，用`wagon:sshexec`来执行部署脚本，配置过程如下：

## 在maven配置文件setting.xml中添加服务器授权信息  
```
  <!-- servers
   | This is a list of authentication profiles, keyed by the server-id used within the system.
   | Authentication profiles can be used whenever maven must make a connection to a remote server.
   |-->
  <servers>
    <server>
        <id>test20</id>
        <!-- 这里是ssh的登录用户名和密码   -->
        <username>root</username>
        <password>123456</password>
    </server>
  </servers>
```

## pom.xml中添加wagon-maven-plugin插件  
```
<build>
    <extensions>
        <extension>
            <groupId>org.apache.maven.wagon</groupId>
            <artifactId>wagon-ssh</artifactId>
            <version>2.12</version>
        </extension>
    </extensions>
    <plugins>
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>wagon-maven-plugin</artifactId>
            <version>2.0.0</version>
            <!-- 配置参数参考http://www.mojohaus.org/wagon-maven-plugin/upload-single-mojo.html -->
            <configuration>
                <!-- 对应setting.xml中指定的id -->
                <serverId>test20</serverId>
                <url>scp://10.0.0.20:22/var/tmp/ssjn</url>

                <!-- 如果不配置serverId，url也可以这样配置 -->
                <!-- <url>scp://root:123456@10.0.0.20:22/var/tmp/ssjn</url> -->

                <!-- 上传单个文件 -->
                <fromFile>${project.build.directory}/${project.build.finalName}.tar</fromFile>
                <!-- 远程文件保存路径，如果为空，默认为本地文件名 -->
                <toFile></toFile>

                <!-- 上传多个文件 -->
                <!-- <fromDir>target/</fromDir> -->
                <!-- 包含的本地文件，用逗号分隔多个文件 -->
                <!-- <includes>${project.artifactId}.tar,${project.artifactId}.war</includes> -->
                <!-- 上传地址，相对于服务器url的相对路径，也可以直接用url指定，不用配置。 -->
                <!-- <toDir></toDir> -->

                <commands>
                    <command>ls -lh /var/tmp/ssjn</command>
                    <command>sh /var/svn/ssjn/ssjn_setup.sh restart</command>
                </commands>
                <!-- 显示运行命令的输出结果 -->
                <displayCommandOutputs>true</displayCommandOutputs>
            </configuration>
        </plugin>
    </plugins>
</build>
```
## 运行

上传单个项目文件并部署：  
`mvn clean package wagon:upload-single wagon:sshexec`

上传多个项目文件并部署：  
`mvn clean package wagon:upload wagon:sshexec`

如果在多模块开发环境中，子模块中配置了wagon插件而父模块没有配置，使用以上命令在项目根目录下打包所有子模块时，可能会由于父pom.xml文件中没有配置wagon插件和相关配置而报错，此时要么在父模块中也配置一个wagon插件，要么在子模块中使用`executions`配置执行任务，绑定一个生命周期，这样就不用在命令中指定插件目标。

## 优化

+ 考虑到可移植性，可以把服务器地址，部署脚本等做成配置项，这样方便后期重用或者改动，比如：

```
<properties>
    <remote-addr>10.0.0.20:22</remote-addr>
    <start-shell>/var/svn/ssjn/ssjn_setup.sh</start-shell>
</properties>

<url>scp://${remote-addr}/var/tmp/ssjn</url>
<command>sh ${start-shell} restart</command>
```

+ 如果觉得运行脚本太长，还可以配置配置execution，在运行package打包的同时运行upload-single和sshexec，如下：  

```
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>wagon-maven-plugin</artifactId>
    <version>2.0.0</version>
    <executions>
        <execution>
            <id>upload-deploy</id>
            <!-- 运行package打包的同时运行upload-single和sshexec -->
            <phase>package</phase>
            <goals>
                <goal>upload-single</goal>
                <goal>sshexec</goal>
            </goals>
            <configuration>
                <serverId>test20</serverId>
                <url>scp://10.0.0.20:22/var/tmp/ssjn</url>
                <fromFile>${project.build.directory}/${project.build.finalName}.tar</fromFile>
                <toFile></toFile>
                <commands>
                    <command>ls -lh /var/tmp/ssjn</command>
                    <command>sh /var/svn/ssjn/ssjn_setup.sh restart</command>
                </commands>
                <displayCommandOutputs>true</displayCommandOutputs>
            </configuration>
        </execution>
    </executions>
</plugin>
```

配置完成后，就可以直接使用`mvn clean package` 来代替 `mvn clean package wagon:upload-single wagon:sshexec`

+ 如果有多台机需要部署，可以在命令中用ssh执行其他机器上的部署脚本：  

```  
<command>/var/svn/ssjn/ssjn_setup.sh setup ssjn-service-boss.tar; sleep 10; ssh 10.0.0.21 "/var/svn/ssjn/ssjn_setup.sh setup ssjn-service-boss.tar"</command>
```

## 参考

[http://www.mojohaus.org/wagon-maven-plugin/](http://www.mojohaus.org/wagon-maven-plugin/)
[https://maven.apache.org/plugins/maven-deploy-plugin/examples/deploy-ssh-external.html](https://maven.apache.org/plugins/maven-deploy-plugin/examples/deploy-ssh-external.html)