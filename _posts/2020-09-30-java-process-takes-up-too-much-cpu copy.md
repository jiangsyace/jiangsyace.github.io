---
title: Java进程占用CPU过高问题排查
date: 2020-09-30
categories:
- tech
tags:
- java
---

## top

top: 查看系统基本状态和所有进程运行状态，可以看到是哪个进程占用cpu高

## ps

ps -mp PID -o THREAD,tid,time   查看线程占用CPU的列表


## printf

printf "%x\n" TID  找到占用CPU最高的线程，查看TID，将其转换为16进制格式  

## jstack

jstack PID |grep 16进制 -A 60              查看堆栈信息

## jmap

jmap -dump:live,format=b,file=cc.bin PID   生成内存快照文件，cc.bin为生成文件名，PID为进程ID。

## 参考

