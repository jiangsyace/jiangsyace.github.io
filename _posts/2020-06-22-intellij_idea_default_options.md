---
title: Intellij IDEA虚拟机参数配置错误导致无法启动
date: 2020-06-22
categories:
- tech
tags:
- idea
---

## 过程

IDEA版本：Intellij IDEA2020.1  
在添加自定的Java代理时，路径设置错误，导致无法启动，也无法修改正确的路径。

## 解决

找到自定义虚拟机参数配置路径重新修改：  
Mac⁩ ▸ ⁨用户⁩ ▸ ⁨user ▸ ⁨资源库⁩ ▸ ⁨Application Support⁩ ▸ ⁨JetBrains⁩ ▸ ⁨IntelliJIdea2020.1⁩ ▸ ⁨idea.vmoptions

## 参考

[https://www.jetbrains.com/help/idea/tuning-the-ide.html](https://www.jetbrains.com/help/idea/tuning-the-ide.html)