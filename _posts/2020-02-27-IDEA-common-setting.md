---
title: Intellij IDEA常用配置
date: 2020-02-27
categories:
- tech
---

Intellij IDEA常用配置及快捷键

<!-- more -->

## 代码提示不区分大小写
Settings -> Editor -> General -> Code Completion -> Match case

## 显示实体类的属性注释
Settings -> Editor -> Code Editing -> Quick Documentation -> Show quick documentation on mouse move

## 自定义类注释和方法注释
新建Class文件的默认注释：

Settings -> Editor -> File and Code Templates -> Class
```
/**
 * 
 * @author shenyun.jiang
 * @date ${DATE} ${TIME}
 */
```
日期格式同系统日期格式，可在日期与时间偏好设置里面修改格式

输入指定按键自动生成的注释：

Settings -> Editor -> Live Templates -> 右上角+号 -> Template Group

创建模板： `+ Live Template`
```
/**
 * @Description: 
 * @param $param$
 * @return $return$ß
 * @author shenyun.jiang
 * @date $date$ $time$
 */
```
Edit variables:
```
#Name    #Expression
--------------------------------------------------
date   : date()
time   : time()
param  : methodParameters()
return : methodReturnType()
--------------------------------------------------
```

## 去除UML类图中多余的依赖线
Settings -> Tools -> Diagrams -> Show Usages

## 禁止检测更新
Settings -> Appearance & Behavior -> System Settings -> Updates

## 常用快捷键
+ Shift + Shift 可在一个弹出框中搜索任何东西，包括类、资源、配置项、方法等等。
+ Ctrl + Tab 切换文件

## 设置IDEA快捷键为Eclipse风格

- 点击File -> Settings -> Keymap，选择快捷键风格为Eclipse
- 按如下表格中的英文描述进行搜索，并改为相应快捷键

| Eclipse            | IDEA               | 英文描述                        | 中文描述                            |
| ------------------ | ------------------ | ------------------------------- | ----------------------------------- |
| ctrl+shift+r       | ctrl+shift+r       | Navigate->File                  | 找工作空间的文件                    |
| ctrl+shift+t       | ctrl+shift+t       | Navigate->Class                 | 找类定义                            |
| ctrl+shift+g       | ctrl+shift+g       | Edit->Find->Find Usages         | 查找方法在哪里调用.变量在哪里被使用 |
| ctrl+t             | ctrl+t             | Other->Hierarchy Class          | 看类继承结构                        |
| ctrl+o             | ctrl+o             | Navigate->File Structure        | 搜索一个类里面的方法                |
| shift+alt+z        | shift+alt+z        | Code->Surround With             | 生成常见的代码块                    |
| shift+alt+l        | shift+alt+l        | Refactor->Extract->Variable     | 抽取变量                            |
| shift+alt+m        | shift+alt+m        | Refactor->Extract->Method       | 抽取方法                            |
| alt+left           | alt+left           | Navigate->Back                  | 回退上一个操作位置                  |
| alt+right          | alt+right          | Navigate->Forward               | 前进上一个操作位置                  |
| ctrl+home          | ctrl+home          | Move Caret to Text Start        | 回到类最前面                        |
| ctrl+end           | ctrl+end           | Move Caret to Text End          | 回到类最后面                        |
| ctrl+2 L           | shift+alt+l        | Refactor->Extract->Variable     | 抽取变量                            |
| ctrl+e             | alt+r              | View->Recent Files              | 最近打开的文件                      |
| ctrl+w             | ctrl+w             | Close                           | 关闭当前窗口                        |
| alt+/              | alt+/              | Code->Completion->Basic         | 提示变量生成                        |
| ctrl+1             | ctrl+1             | Other->Show Intention Actions   | 提示可能的操作                      |
| ctrl+h             | ctrl+h             | Find in Path                    | 全局搜索                            |
| alt+上/下箭头      | alt+上/下箭头      | Code->Move Line Up/Down         | 移动一行代码                        |
| ctrl+alt+上/下箭头 | ctrl+alt+上/下箭头 | Editor Actions->Duplicate Lines | 复制一行                            |
| ctrl+shift+j       | ctrl+shift+j       | Other->Fix doc comment          | 方法注释                            |
| 暂无               | alt+enter          | Other->Show Intention Actions   | 提示常见操作                        |
| Ctrl+F             | Ctrl+F/Ctrl+R      | Find/Replace                    | 查找替换                            |
| Shift+Enter        | Shift+Enter        | Start New Line                  | 开启新的一行                        |
| Ctrl+Alt+S         | Ctrl+Alt+S         | Generate                        | 生成getter,setter,tostring等        |

## 打开多个文件显示在多行tab上
Settings -> Editor -> General -> Editor tabs -> show tabs in single row

## 显示实时内存
View -> Appearance -> Status Bar Widgets -> Memory Indicator

## 自动换行显示
这个操作只会对单个文件生效，不会全局生效

View -> Active Editor -> Use Soft Wraps



