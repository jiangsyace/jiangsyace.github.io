---
title: ����ݮ���ϰ�װ���������ķ���  
date: 2020-03-17
categories:
- tech
tags:
- docker
---

����ݮ���ϰ�װDocker��MySQL��Zookeeper��Redis��RabbitMQ�ȷ��񣬱�����Windows��Mac���������л���

<!-- more -->

## Docker

### ��װdocker

���ذ�װ�ű���
```
curl -fsSL https://get.docker.com -o get-docker.sh
```

ʹ�ð����ƾ������ذ�װ��

```
sh get-docker.sh --mirror Aliyun

curl -sSL https://get.docker.com| sh
```

Ĭ�������ִ��docker��������ҪrootȨ�޵ģ�Ҳ����Ҫ��sudo docker �����С����Խ���ǰ�û�����docker�飬��������Ч��
```
sudo usermod -aG docker $USER && sudo reboot
```
�˳���ǰ�ն˲����µ�¼����ʱ����docker������Ҫ��sudoȨ��

ע�⣺

��ݮ����arm�ܹ��ģ����Բ���ʹ��x86ƽ̨�ľ�����ʹ��docker pull ��ȡʱ��docker���Զ����ݵ�ǰ�ܹ�ȥ�����Ƿ��мܹ�ƥ��ľ������ԣ���������ƾ�������Ҫ��ƽ̨����

### ��װDocker Compose 

��Ϊ��÷����arm�ܹ���docker-compose��û���ṩ�ٷ��Ķ������ļ��ģ���������Ҫʹ��python��pip��������װdocker-compose��

����apt���Դ��
```
sudo apt-get update
```

��װpython��pip��
```
sudo apt-get install -y python python-pip
```

��װlibffi-dev�������ڰ�װdocker-compose��ʱ��ᱨ��
```
sudo apt-get install -y libffi-dev
```

ʹ��pip��װdocker-compose����ʱʹ���пƴ�����Դ��
```
sudo pip install docker-compose -i https://pypi.mirrors.ustc.edu.cn/simple/  --trusted-host  pypi.mirrors.ustc.edu.cn
```

### Docker����������Դ

����ݮ��docker�й�������ʱ�����Ҫ���ľ������Դ��ʹ�ð������£�

```
FROM mcr.microsoft.com/dotnet/core/aspnet:3.0
#��װffmpeg����
RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y ffmpeg \
    && apt-get clean && apt-get autoclean && apt-get autoremove \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY ./publish/ /app 
#Ĭ�Ͼ���80�˿ڣ����Ҫ��Ķ˿ڣ�������Ҫ��ȷָ�������˿ں�
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet","WebMvc.dll"]
```
## MySQL

����ݮ���Ϲٷ�mysql�����޷�ʹ�ã���Ϊ��ݮ�ɵļܹ�Ϊarm������ʹ�õ�ӳ�������ԣ�[https://hub.docker.com/r/hypriot/rpi-mysql/]

pullӳ��
```
docker pull hypriot/rpi-mysql
```

�鿴ӳ��
```
docker images
```

����mysqlʵ����
```
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d -p 3307:3306 hypriot/rpi-mysql
```
�����Ĭ��������Ϊmy-secret-pw���ͻ������Ӷ˿�����Ϊ3307��

�鿴����״̬��
```
docker ps -a
```

�����ʾ��3306�˿ڣ����ʾ�����ɹ��������exit(����)�����ʾ��������ʧ�ܣ����Բ鿴��־��ʹ��
```
docker logs ������ 
```

����mysql��
```
# ��¼
mysql -uroot -pmy-secret-pw
# �л����ݿ�
use mysql;
# ��ʾ��
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

����˵����
```
--privileged=true   # ʹcontainer�ڵ�rootӵ��������rootȨ��
--name              # ��������
-i 	                # �Խ���ģʽ����������ͨ���� -t ͬʱʹ�ã�
-t 	                # Ϊ�������·���һ��α�����նˣ�ͨ���� -i ͬʱʹ�ã�
-d 	                # ��̨��������������������ID��
-p(--publish) 	    # ָ���˿�ӳ�䣬��ʽΪ���������˿�:�����˿�
--restart always    # �� docker ����ʱ�������Զ�����
-v                  # ����Ŀ¼����ʽΪ��������Ŀ¼:����Ŀ¼
```

���õ� docker ����ʱ�������Զ�������
```
docker container update --restart=always ������
```

## Redis



## RabbitMQ




## �ο�
[��ݮ�ɰ�װʹ��docker](https://www.cnblogs.com/kasnti/p/11833778.html)