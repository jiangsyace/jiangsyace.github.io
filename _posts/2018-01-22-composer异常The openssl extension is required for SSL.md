---
title: composer异常The openssl extension is required for SSL
date: 2018-1-22 20:07:58
categories:
- tech
tags:
- php
- problem
---

使用composer创建laravel项目的时候，发现报错The openssl extension is required for SSL/TLS protection but is not available。

```
composer create-project laravel/laravel mylaravel1 5.4.* --prefer-dist

[Composer\Exception\NoSslException]                                           

The openssl extension is required for SSL/TLS protection but is not available. If you can not enable the openssl ex
tension, you can disable this error, at your own risk, by setting the 'disable-tls' option to true.
```

<!-- more -->

出现这样的错误，是由于没有开启php的openssl扩展。但是`php.ini`文件中`extension=php_openssl.dll`已经打开。

使用`php -i`定位配置文件位置

```
php -i | grep 'php.ini'
Configuration File (php.ini) Path: C:\WINDOWS
```

显示配置文件在C:/Windows下，但是该目录下并没有找到php.ini文件，于是复制php安装目录下的php.ini到C:/Windows目录下。再次执行创建项目命令，弹出窗口提示

```
PHP Startup: fileinfo:Unable to initialize module
```

最后发现环境变量配置php路径还是旧版本的php路径，修改为最新路径，问题解决。（修改环境变量要重启cmd）



