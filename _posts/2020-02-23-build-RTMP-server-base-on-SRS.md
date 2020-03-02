---
title: 基于SRS搭建RTMP直播流媒体服务器
date: 2020-02-23
categories:
- tech
---

基于SRS搭建RTMP直播流媒体服务器，客户端使用OBS推流。

<!-- more -->

## 软件定位

SRS 定位是运营级的互联网直播服务器集群，追求更好的概念完整性和最简单实现的代码。

+ 运营级：商业运营追求极高的稳定性、良好的系统对接、错误排查和处理机制。譬如日志文件格式、reload、系统 HTTP 接口、提供 init.d 脚本、转发、转码和边缘回多源站，都是根据 CDN 运营经验作为判断这些功能作为核心的依据。

+ 互联网：互联网最大的特征是变化，唯一不变的就是不断变化的客户要求，唯一不变的是基础结构的概念完整性和简洁性。互联网还意味着参与性，听取用户的需求和变更，持续改进和维护。

+ 直播服务器：直播和点播这两种截然不同的业务类型，导致架构和目标完全不一致，从运营的设备组，到应对的挑战都完全不同。两种都支持只能说明没有重心或者低估了代价。

+ 集群：FMS(AMS) 的集群还是很不错的，虽然运营容错很差。SRS 支持完善的直播集群，Vhost 分为源站和边缘，容错支持多源站切换、测速、可追溯日志等。

+ 概念完整性：虽然代码甚至结构都在变化，但是结构的概念完整性是一直追求的目标。SRS 服务器、P2P、ARM 监控产业、MIPS 路由器，服务器监控管理、ARM 智能手机，SRS 的规模不再是一个服务器而已。

## 软件应用

+ 搭建大规模 CDN 集群，可以在 CDN 内部的源站和边缘部署 SRS。

+ 小型业务快速搭建几台流媒体集群，譬如学校、企业等，需要分发的流不多，同时 CDN 覆盖不如自己部署几个节点，可以用 SRS 搭建自己的小集群。

+ SRS 作为源站，CDN 作为加速边缘集群。比如推流到 CDN 后 CDN 转推到源站，播放时 CDN 会从源站取流。这样可以同时使用多个 CDN。同时还可以在源站做 DRM 和 DVR，输出 HLS，更重要的是如果直接推 CDN，一般 CDN 之间不是互通的，一个 CDN 出现故障无法快速切换到其他 CDN。

+ 编码器可以集成 SRS 支持拉流。一般编码器支持推 RTMP/UDP 流，如果集成 SRS 后，可以支持多种拉流。

+ 协议转换网关，比如可以推送 FLV 到 SRS 转成 RTMP 协议，或者拉 RTSP 转 RTMP，还有拉 HLS 转 RTMP。SRS 只要能接入流，就能输出能输出的协议。

+ 学习流媒体可以用 SRS。SRS 提供了大量的协议的文档、wiki 和文档对应的代码、详细的 issues、流媒体常见的功能实现，以及新流媒体技术的尝试等。

## 软件部署


第一步，获取 SRS。[详细参考](https://github.com/ossrs/srs/wiki/v1_CN_Git)

```
$ git clone https://github.com/ossrs/srs
$ cd srs/trunk
```

第二步，编译 SRS。[详细参考](https://github.com/ossrs/srs/wiki/v1_CN_Build)

```
$ ./configure && make
```

第三步，编写 SRS 配置文件。[详细参考](https://github.com/ossrs/srs/wiki/v1_CN_DeliveryRTMP)

将以下内容保存为文件 conf/srs.conf，服务器启动时指定该配置文件 (srs 的 conf 文件夹中有该文件)。

```
# conf/srs.conf
listen              888;
#默认端口为1935
max_connections     1000;
srs_log_file        ./objs/srs.log;
vhost stream.didi.com {
}
```

第四步，启动SRS。
```
$ ./objs/srs -c conf/srs.conf
```

第五步，启动推流编码器。

Linux 系统下可以使用 FFMPEG 进行推流；Windows/Ios 系统下可选择 OBS 进行推流。（本文我们使用 FFMPEG 进行推流演示）

- 获取 FFMPEG
```
$ git clone https://git.ffmpeg.org/ffmpeg.git ffmpeg
$ cd ffmpeg
```

- 编译 FFMPEG
```
$./configure && make
```

如果编译失败，请根据提示内容安装依赖环境或忽略。

- 使用 FFMPEG推流
```
$./ffmpeg -re -i ../test.mp4  -f flv -y rtmp://x.x.x.x:xx/live
```

第六步，观看直播流。

+ 可使用软件 VLC 播放。
+ 可使用 [CUTV在线播放器](http://www.cutv.com/demo/live_test.swf) 播放。
+ 可使用 [SRS在线播放器](http://winlinvip.github.io/srs.release/trunk/research/players/srs_player.html) 播放。
