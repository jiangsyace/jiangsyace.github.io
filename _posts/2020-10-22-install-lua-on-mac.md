---
title: Mac上安装lua
date: 2020-10-22
categories:
- tech
tags:
- lua
---


1. curl -R -O http://www.lua.org/ftp/lua-5.3.0.tar.gz
2. tar zxf lua-5.3.0.tar.gz
3. cd lua-5.3.0/src
4. make macosx test
5. cd ../
6. sudo make install
7. lua

## 可能出现的问题

`xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun`

**解决办法：**  
终端输入命令：`xcode-select --install`

## 安装luarocks

brew install luarocks

luarocks install lua-cjson

brew link luarocks


(base) XYSZMSHENYUNJIANG:~ shenyun.jiang$ brew link luarocks
Linking /usr/local/Cellar/luarocks/3.4.0... Error: Permission denied @ dir_s_mkdir - /usr/local/share/lua/5.3
(base) XYSZMSHENYUNJIANG:~ shenyun.jiang$ sudo brew link luarocks
Password:
Error: Running Homebrew as root is extremely dangerous and no longer supported.
As Homebrew does not drop privileges on installation you would be giving all
build scripts full access to your system.

(base) XYSZMSHENYUNJIANG:~ shenyun.jiang$ sudo chown -R shenyun.jiang /usr/local/share/lua/
(base) XYSZMSHENYUNJIANG:~ shenyun.jiang$ brew link luarocks
Linking /usr/local/Cellar/luarocks/3.4.0... 96 symlinks created
(base) XYSZMSHENYUNJIANG:~ shenyun.jiang$ luarocks


https://luarocks.org/modules/openresty/lua-cjson





使用brew安装程序提示如下错误

Error: Running Homebrew as root is extremely dangerous and no longer supported.

As Homebrew does not drop privileges on installation you would be giving all

build scripts full access to your system.

如何解决呢？这是因为新的MAC系统不允许在root用户下使用brew命令安装软件了。首先切换到普通用户

