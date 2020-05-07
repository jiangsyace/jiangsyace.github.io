---
title: Gitbook在 Mac 环境上的安装及使用
date: 2020-05-07
categories:
- tech
tags:
- markdown
---

## 一、在 Mac 环境上搭建 gitbook

```
#1.安装node.js，在node.js官网下载，直接安装稳定版本。
https://nodejs.org/en/

#2.检测 node.js 是否安装成功
npm -v

#3.安装 gitboot 和命令行工具 -g 代表全局安装
sudo npm install gitbook -g 
sudo npm install gitbook-cli -g

#4.检测是否安装成功 v 大写
gitbook -V
gitbook -version

#更新 gitbook 命令行工具
sudo npm update gitbook-cli -g

#卸载 GitBook 命令
sudo npm uninstall gitbook-cli -g

#查看安装位置
which gitbook

#5.安装 gitboot editor,方便编辑书籍
https://legacy.gitbook.com/editor/osx

#6.安装calibre,calibre是一款非常方便的开源电子书转换软件
https://calibre-ebook.com/download

#7.将安装的calibre放在应用程序中,执行
sudo ln -s /Applications/calibre.app/Contents/MacOS/ebook-convert /usr/local/bin

```

## 二、gitbook的使用

```
# 1.创建 mygitbook 文件夹，作为第一本书,并切换到这个文件夹下面
mkdir mygitbook && cd mygitbook

#2.初始化 gitbook 工作目录，创建必要的文件
gitbook init
#README.md - 项目的介绍都写在这个文件里。
#SUMMARY.md - GitBook 的目录结构在这里配置。

#3.编辑目录结构

#4.目录建好以后在根目录下执行命令,只支持2级目录：
gitbook init

#编写 gitbook 内容,重新编译
gitbook build

#5.在根目录执行命令,启动服务：
gitbook serve

#6.访问,用浏览器打开 http://localhost:4000/ 或 http://127.0.0.1:4000/ 查看显示书籍的效果。结束预览 ctrl+c

#7.生成电子书,依赖于Calibre
gitbook mobi ./ ./MyFirstBook.mobi

#8.生成可跳转的目录
在VSCode安装Markdown TOC插件，在md文件中右键，选择`Markdown TOC:Insert/Update`，生成之后默认行尾字符为auto，修改设置搜索`eol`，将默认行尾字符改为`\n`，再重新生成。
```
