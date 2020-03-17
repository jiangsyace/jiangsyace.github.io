---
title: 在树莓派上安装开发依赖的服务  
date: 2020-03-17
categories:
- tech
tags:
- docker
---

在树莓派上安装Docker，MySQL，Zookeeper，Redis，RabbitMQ等服务，便于在Windows和Mac开发环境切换。

<!-- more -->

## Docker

### 安装docker

下载安装脚本：
```
curl -fsSL https://get.docker.com -o get-docker.sh
```

使用阿里云镜像下载安装：

```
sh get-docker.sh --mirror Aliyun

curl -sSL https://get.docker.com| sh
```

默认情况下执行docker命令是需要root权限的，也就是要用sudo docker 来运行。可以将当前用户加入docker组，并重启生效：
```
sudo usermod -aG docker $USER && sudo reboot
```
退出当前终端并重新登录，此时操作docker不再需要加sudo权限

注意：

树莓派是arm架构的，所以不能使用x86平台的镜像，在使用docker pull 拉取时，docker会自动根据当前架构去查找是否有架构匹配的镜像，所以，如果是自制镜像，则需要分平台编译

### 安装Docker Compose 

因为树梅派是arm架构，docker-compose是没有提供官方的二进制文件的，所以我们要使用python的pip工具来安装docker-compose。

更新apt软件源：
```
sudo apt-get update
```

安装python和pip：
```
sudo apt-get install -y python python-pip
```

安装libffi-dev，否则在安装docker-compose的时候会报错：
```
sudo apt-get install -y libffi-dev
```

使用pip安装docker-compose，临时使用中科大的软件源：
```
sudo pip install docker-compose -i https://pypi.mirrors.ustc.edu.cn/simple/  --trusted-host  pypi.mirrors.ustc.edu.cn
```

### Docker镜像更改软件源

在树莓派docker中构建镜像时，如果要更改镜像软件源，使用案例如下：

```
FROM mcr.microsoft.com/dotnet/core/aspnet:3.0
#安装ffmpeg工具
RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y ffmpeg \
    && apt-get clean && apt-get autoclean && apt-get autoremove \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY ./publish/ /app 
#默认就是80端口，如果要别的端口，代码中要明确指定监听端口号
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet","WebMvc.dll"]
```
## MySQL

在树莓派上官方mysql镜像无法使用，因为树莓派的架构为arm，这里使用的映像是来自：[https://hub.docker.com/r/hypriot/rpi-mysql/]

pull映像：
```
docker pull hypriot/rpi-mysql
```

查看映像：
```
docker images
```

启动mysql实例：
```
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d -p 3307:3306 hypriot/rpi-mysql
```
这里把默认密码设为my-secret-pw，客户端连接端口设置为3307。

查看启动状态：
```
docker ps -a
```

如果显示有3306端口，则表示启动成功，如果有exit(代码)，则表示启动容器失败，可以查看日志，使用
```
docker logs 容器名 
```

测试mysql：
```
# 登录
mysql -uroot -pmy-secret-pw
# 切换数据库
use mysql;
# 显示表
show tables;
```

## Zookeeper

https://hub.docker.com/_/zookeeper?tab=tags

```
docker pull zookeeper:3.4.13

docker run -d --privileged=true --name some-zookeeper --restart always -v $(pwd)/zoo.cfg:/conf/zoo.cfg zookeeper:3.4.13

docker run -d --privileged=true --name some-zookeeper --restart always --publish 2181:2181 zookeeper:3.4.13

docker run -d --privileged=true --name some-zookeeper --restart always --publish 2181:2181 zookeeper:latest
```

参数说明：
```
--privileged=true   # 使container内的root拥有真正的root权限
--name              # 设置名称
-i 	                # 以交互模式运行容器，通常与 -t 同时使用；
-t 	                # 为容器重新分配一个伪输入终端，通常与 -i 同时使用；
-d 	                # 后台运行容器，并返回容器ID；
-p(--publish) 	    # 指定端口映射，格式为：宿主机端口:容器端口
--restart always    # 当 docker 重启时，容器自动启动
-v                  # 挂载目录，格式为：宿主机目录:容器目录
```

设置当 docker 重启时，容器自动启动：
```
docker container update --restart=always 容器名
```

## Redis



## RabbitMQ




## 参考
[树莓派安装使用docker](https://www.cnblogs.com/kasnti/p/11833778.html)