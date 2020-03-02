---
title: Mac搭建开发环境
date: 2019-12-25
categories:
- tech
tags:
- java
---

Mac下安装JDK，配置环境变量，安装Maven和Tomcat等开发常用软件。

<!-- more -->

## 安装JDK

### 下载
在官网下载JDK安装包，下载页面：[https://www.oracle.com/technetwork/java/javase/downloads/index.html](https://www.oracle.com/technetwork/java/javase/downloads/index.html)，这里选择jdk8，直达页面：[https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)，选择jdk-8u231-macosx-x64.dmg文件下载。
下载文件后可以直接在界面引导下安装完成，一般Java的默认安装目录在`/Library/Java/JavaVirtualMachines\`下，安装好后的完整jdk主目录为：`/Library/Java/JavaVirtualMachines/jdk1.8.0_231.jdk/Contents/Home`。

### 配置
安装完成后配置环境变量，打开终端使用`vi ~/.bash_profile`命令编辑配置文件。
加入以下内容：
```
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_231.jdk/Contents/Home
PATH=$JAVA_HOME/bin:$PATH:.
CLASSPATH=$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar:.
export JAVA_HOME
export PATH
export CLASSPATH
```

使配置文件生效，在终端中输入以下命令：

```
$ source ~/.bash_profile
```

### 验证
输入`echo $JAVA_HOME`可以显示刚才配置的路径，输入`java -version`可以查看java版本，正确显示java版本号就安装成功了~

## 安装Maven

### 下载
Maven官方下载页面:[https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)

### 安装配置
下载`apache-maven-3.6.3-bin.tar.gz`文件后解压到软件安装目录，在终端使用`vim ~/.bash_profile`编辑配置文件，加入以下内容：
```
export M2_HOME=$HOME/Program/apache-maven-3.6.3
export PATH=$PATH:$M2_HOME/bin
```
添加之后保存并退出，执行以下命令使配置生效：
```
$ source ~/.bash_profile
```

### 验证
输入：`mvn -v`命令可以查看maven版本信息。

## 安装Gradle

在官司下载最新版，解压到软件安装目录，然后配置环境变量。在终端使用`vi ~/.bash_profile`命令编辑配置文件，加入以下内容：

```
export GRADLE_HOME=$HOME/Program/gradle-6.0.1
export PATH=${PATH}:${GRADLE_HOME}/bin
```

保存后退出编辑，使用`source ~/.bash_profile`命令使配置生效。然后命令行输入`gradle -v`查看版本以验证是否安装成功。

## 安装Tomcat

Tomcat官网：[http://tomcat.apache.org/](http://tomcat.apache.org/)，下载后解压至软件安装目录即可。

## 安装brew
brew 是 Mac 下的一个包管理工具，类似于 centos 下的 yum，可以很方便地进行安装/卸载/更新各种软件包，例如：nodejs, elasticsearch, kibana, mysql, mongodb 等等，可以用来快速搭建各种本地环境。
brew 官网：https://brew.sh/

### 安装
首先通过如下命令安装 brew：
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
如果出现了这个错误：
```
curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused。
```
有两种方式可以解决：

1. 设置代理（只对当前终端有效）
```
export HTTP_PROXY=http://127.0.0.1:1087     # http代理
export HTTPS_PROXY=http://127.0.0.1:1087    # https代理
export ALL_PROXY=socks5://127.0.0.1:1086    # 所有代理
```
2. 把脚本下下来：https://raw.githubusercontent.com/Homebrew/install/master/install 保存为 `brew_install.rb`，然后使用`ruby brew_install.rb`开始安装。

### 基本用法

以 nodejs 为例，执行下面命令即可，安装目录在 /usr/local/Cellar
```   
brew install nodejs
```   
如果需要更新或卸载
```   
brew upgrade nodejs
brew remove nodejs
```   

### 其他命令
```shell
brew list                   # 列出当前安装的软件
brew services list          # 列出当前服务的状态
brew search nodejs          # 查询与 nodejs 相关的可用软件
brew info nodejs            # 查询 nodejs 的安装信息
brew install tree           # 查看目录结构
brew install wget           # wget http客户端
```   

如果需要指定版本，可以在 `brew search` 查看有没有需要的版本，在 `@` 后面指定版本号，例如 `brew install thrift@0.9`


## Nginx

```shell
# 安装命令
brew install nginx

# 默认doc目录
/usr/local/var/www

# 默认端口
8080

# 配置文件目录
/usr/local/etc/nginx/nginx.conf
/usr/local/etc/nginx/servers/

# 命令
brew services start nginx
brew services stop nginx
```  

## Mysql
```  
# 安装
brew install mysql@5.7

# 路径处理
echo 'export PATH="/usr/local/opt/mysql@5.7/bin:$PATH"' >> ~/.zshrc
export LDFLAGS="-L/usr/local/opt/mysql@5.7/lib"
export CPPFLAGS="-I/usr/local/opt/mysql@5.7/include"
export PKG_CONFIG_PATH="/usr/local/opt/mysql@5.7/lib/pkgconfig"

# 在后台运行mysql
brew services start mysql@5.7

# 在前台运行mysql
/usr/local/opt/mysql@5.7/bin/mysql.server start
```  

## Redis
```shell
# 安装
brew install redis
# 后台启动
brew services start redis
# 前台启动
redis-server /usr/local/etc/redis.conf
```  

## Maven

```shell
# 安装
brew install maven
```  

配置：`vi ~/.m2/settings.xml`

```xml
<?xml version="1.0" encoding="UTF-8" ?>

<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">

<mirrors>
    <mirror>
        <id>nexus-aliyun</id>
        <mirrorOf>central</mirrorOf>
        <name>Nexus aliyun</name>
            <url>http://maven.aliyun.com/nexus/content/groups/public</url>
    </mirror>
</mirrors>
<profiles>
    <profile>
        <id>jdk18</id>
        <activation>
            <jdk>1.8</jdk>
            <activeByDefault>true</activeByDefault>
        </activation>
        <properties>
            <maven.compiler.source>1.8</maven.compiler.source>
            <maven.compiler.target>1.8</maven.compiler.target>
            <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
        </properties>
    </profile>
</profiles>

</settings>
```  

## nodejs环境

```shell
# 安装node
brew install node
# 安装淘宝镜像
npm install -g cnpm --registry=https://registry.npm.taobao.org
```  
## ELK

### 安装ElasticSearch

```shell
brew install elasticsearch          # 安装 elasticsearch
brew services start elasticsearch   # 启动 elasticsearch
brew services stop elasticsearch    # 停止 elasticsearch
brew services restart elasticsearch # 重启 elasticsearch
elasticsearch --version             # 查看 elasticsearch 版本
```  

### 安装Logstash

```shell
brew install logstash
logstash --version
```  


### 安装Kibana

通过Homebrew安装：https://www.elastic.co/guide/en/kibana/7.5/brew.html 

直接下载：https://www.elastic.co/cn/downloads/kibana

```
brew tap elastic/tap
brew install elastic/tap/kibana-full
```