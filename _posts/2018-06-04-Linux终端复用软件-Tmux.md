---
title: Linux终端复用软件-Tmux
date: 2018-6-4 19:39:55
categories:
- tech
tags:
- linux
---
Tmux是一个优秀的终端复用软件，类似GNU Screen，但来自于OpenBSD，采用BSD授权。使用它最直观的好处就是，通过一个终端登录远程主机并运行tmux后，在其中可以开启多个控制台而无需再“浪费”多余的终端来连接这台远程主机；是BSD实现的Screen替代品，相对于Screen，它更加先进：支持屏幕切分，而且具备丰富的命令行参数，使其可以灵活、动态的进行各种布局和操作。

<!-- more -->

## 简介

tmux 应用程序的名称来源于终端（terminal）复用器（muxer）或多路复用器（multiplexer）。tmux中有3种概念，会话(session)，窗口(window)，窗格(pane)。一个会话可以包含多个窗口，一个窗口可以被分割成多个窗格。

下面是三个元素在tmux中的具体展现：
![](/assets/upload/6941baebjw1et4uosbtuhj21kw0qvqf1.jpg)

tmux的github地址：[https://github.com/tmux/tmux](https://github.com/tmux/tmux)  
tmux官网：[http://tmux.github.io/](http://tmux.github.io/)

**Tmux功能** ：
-  提供了强劲的、易于使用的命令行界面。
-  可横向和纵向分割窗口。
-  窗格可以自由移动和调整大小，或直接利用四个预设布局之一。
-  支持 UTF-8 编码及 256 色终端。
-  可在多个缓冲区进行复制和粘贴。
-  可通过交互式菜单来选择窗口、会话及客户端。
-  支持跨窗口搜索。
-  支持自动及手动锁定窗口。

## Tmux安装

+ ubuntu版本下直接apt-get安装
```
$ sudo apt-get install tmux
```
+ centos7版本下直接yum安装
```
$ yum install -y tmux
```

## Tmux的使用

### tmux命令
```
$ tmux                            运行tmux程序
$ tmux -V                         查看tmux当前版本
$ tmux new                        新建默认名称的会话
$ tmux new -s s1                  新建名为s1的会话
$ tmux new -s s1 -d               在后台建立会话 
$ tmux rename-seesion s2          重命名上次打开的会话为s2
$ tmux rename -t s1 s2　        　重命名会话s1为s2
$ tmux switch -t s2               切换到会话s2
$ tmux kill-session　           　删除上次打开的会话
$ tmux kill-session -t s1         删除会话s1
$ tmux kill-session -a -t s1　  　删除除s1外的所有会话
$ tmux kill-server　　            关闭所有会话
$ tmux ls                         列出所有会话
$ tmux list-sessions              列出所有会话
```

#### 脱离和附加

tmux 最强大的功能之一是能够脱离和重新附加到会话。 当你脱离的时候，你可以离开你的窗口和窗格独立运行。 此外，您甚至可以完全注销系统。 然后，您可以登录到同一个系统，重新附加到 tmux 会话，查看您离开时的所有窗口和窗格。 脱离的时候你运行的命令一直保持运行状态。

以下命令和快捷键可以脱离一个会话，重新返回到一个标准的单一shell。
```
ctrl+b d                  脱离会话快捷键
tmux detach               脱离会话命令
```

如果要重新附加到会话中，使用以下命令：
```
$ tmux a                  快速连接所有会话中的第一个
$ tmux a -t session       通过会话名连接一个会话
$ tmux attach             快速连接所有会话中的第一个
$ tmux attach-session     通过会话名连接一个会话
$ tmux attach -t session  通过会话名连接一个会话
```

### tmux快捷键

**注意**：进入tmux窗口后，一定要先按ctrl+b，然后松开，再按其他的组合键才生效。

```
ctrl+b ?                  显示快捷键帮助
```

#### Session相关操作
```
ctrl+b s                  查看/切换会话
ctrl+b d                  脱离当前会话，回到终端环境
ctrl+b $                  重命名当前会话	
ctrl+b :kill-session      删除当前会话
ctrl+b :kill-server       删除所有会话
```

#### Window相关操作
```
ctrl+b c                  新建窗口
ctrl+b &                  确认后关闭当前窗口
ctrl+b l                  最后使用的窗口
ctrl+b 数字               使用窗口号切换
```

#### Pane相关操作
```
ctrl+b o                  切换到下一个窗格
ctrl+b n                  选择下一个窗格
ctrl+b p                  选择上一个窗格
ctrl+b q                  查看所有窗格的编号
ctrl+b "                  垂直拆分出一个新窗格
ctrl+b %                  水平拆分出一个新窗格
ctrl+b x                  删除窗格
ctrl+b :                  命令模式
ctrl+b !                  把当前窗格变为新窗口
ctrl+b [                  复制模式，即将当前屏幕移到上一个的位置上，其他所有窗口都向前移动一个。
ctrl+b w                  以菜单方式显示及选择窗口
ctrl+b t                  显示时钟。然后按enter键后就会恢复到shell终端状态
ctrl+b z                  最大化/最小化一个窗格
ctrl+b 空格键             上下分屏与左右分屏切换
ctrl+b 方向键             切换窗格
```

## Tmux配置
编辑tmux配置文件`vim ~/.tmux.conf `  
修改配置文件后，在命令模式（按ctrl+b : )，输入以下命令生效：
``` 
source ~/.tmux.conf
```
或者再终端环境下输入：
``` 
tmux source ~/.tmux.conf
```
可能会提示`no server running on xxx`，新建一个会话再重新执行命令就可以了

### 修改默认前缀
tmux命令都具有一个前缀命令(PREFIX)，默认的是ctrl+b，可以自己修改，改为ctrl+a。 
在`~/.tmux.conf`中加入如下行：
```
set -g prefix C-a 
unbind C-b 
```

### 启用鼠标控制
编辑`~/.tmux.conf`，添加：  
```
# tmux2.1及以后版本：
set-option -g mouse on

# tmux2.1之前版本：
setw -g mouse-resize-pane on
setw -g mouse-select-pane on
setw -g mouse-select-window on
setw -g mode-mouse on
```

复制 按住`shift`键,然后拖动鼠标复制要选择的内容，然后按下`shift+ctrl+c`,复制到系统剪贴板  
粘贴 按下`shift+ctrl+v` 粘贴系统剪贴板中的内容到tmux中  
需要注意的是:  
`shift+ctrl+v`是在终端设置的粘贴快捷键  
`shift+ctrl+c`是在终端设置的复制快捷键  
需要根据你的终端配置的复制粘贴快捷键来进行操作  

### 脚本

脚本可以让我们构造自己的tmux布局模版

比如下面这个脚本可以快速把当前窗口分割三个窗格并打印当前路径
```
# 选择0号窗格
select-pane -t 0  
# 纵向切割窗口并设置宽度为50%
split-window -h -p 50
# 选择1号窗格
select-pane -t 1
# 横向切割窗口并设置高度为50%
split-window -v -p 50
# 发送指令
send-keys -t 0 'pwd' C-m
# The C-m at the end is interpreted by Tmux as the enter key.
select-pane -t 0
```
把这个脚本放在 `~/.tmux/preset`，然后在 `~/.tmux.conf` 绑定快捷键: `bind T source-file ~/.tmux/preset`  
这样, 就可以通过快捷键 `C-b S-t` 一键分割当前窗格.

## 文档链接
[http://man.openbsd.org/OpenBSD-current/man1/tmux.1](http://man.openbsd.org/OpenBSD-current/man1/tmux.1)  
