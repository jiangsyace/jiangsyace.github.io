---
title: 2020-02-15-Anaconda环境管理
date: 2020-02-15
categories:
- tech
tags:
- python
---

conda环境管理
<!-- more -->

[https://anaconda.org/](https://anaconda.org/)

### 查看环境
```
conda env list
```

### 创建环境
```
conda create -n python36 python=3.6
```

### 进入环境

source activate python36
activate python36  # windows下

### 搜索包

```
conda search mxnet*
```

### 指定环境，查看已安装的包

```
conda list -n python36
```

### 指定环境，安装指定版本的包

```
conda install -n python36 mxnet==1.0.0
```

### 指定环境，更新包

```
conda update -n python36 mxnet
```

### 指定环境，删除包

```
conda remove -n python36 mxnet
```

### 导出环境为yml

```
conda env export >  environment.yml
```

### 根据yml创建环境

```
conda env create -f environment.yml
```

### 对yml文件修改后更新环境

```
conda env update -f environment.yml
```

### 退出环境

```
source deactivate
deactivate # windows下
```

### 复制环境

```
conda create -n python36 --clone python36_new
```

### 删除环境

```
conda remove -n python36 --all
```

### 更改镜像源

```
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --set show_channel_urls yes
```

修改后可以在~/.condarc配置文件中可以看到相应信息

### pip修改镜像源（修改~/.pip/pip.conf配置文件）

```
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
```

### 安装指定包
```
# tushare - python2.7
# https://anaconda.org/waditu/tushare
conda install -c waditu tushare

# tushare - python3.7
# https://tushare.pro/document/1?doc_id=7
pip install tushare

```

### 其他常用

```
conda info       #查看设定信息
conda --version  #查看版本

```


