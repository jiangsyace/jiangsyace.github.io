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