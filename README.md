加入QQ群讨论：[![QQ](http://pub.idqqimg.com/wpa/images/group.png)](https://jq.qq.com/?_wv=1027&k=5HWgxBZ)
## RuoYiPlus简介

在RuoYi项目基础上改造，通过多模块的方式整合其他J2EE项目中经常被用到的功能模块；

RuoYi 是一个 Java EE 企业级快速开发平台，基于经典技术组合（Spring Boot、Apache Shiro、MyBatis、Thymeleaf、Bootstrap、Hplus），内置模块如：部门管理、角色用户、菜单及按钮授权、数据权限、系统参数、日志管理、通知公告等。在线定时任务配置；支持集群，支持多数据源。

### 3分钟教程

三步骤启动后台管理系统，layui开发UI，八成代码自动生成：

- 下载您的子工程：http://h5.sumslack.com/ruoyiplus/project.zip
- 解压后导入该maven项目，并修改`application-druid.yml`中的数据源；
- 编写main函数即可启动后台管理系统：
```
package com.sumslack.me;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.WebApplicationInitializer;
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
@ComponentScan(basePackages= {"com.ruoyi","com.sumslack.me"})
public class MainApplication extends SpringBootServletInitializer implements WebApplicationInitializer{
    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }
}
```
启动后，即可看到后台管理系统：

<img src="http://h5.sumslack.com/ruoyiplus/ruoyiplus.jpg"/>

- 开发您的业务模块：进入后台，点击代码生成，选择一个表按需生成前后台代码即可。

### RuoYiPlus新增特性
1. 整合MybatisPlus，一键生成Model，Dao，Service等代码，提供灵活的数据库操控方式；
1. 子系统生成；
1. 表管理（自定义表单）
    - 独立数据库数据源
    - 单表CRUD代码自动生成
1. 代码生成改造
    - 支持复杂表单代码的自动生成；
    - 模板管理；
1. 整合数据推送（可选）；
1. UI根据layui的kit_admin完全重写；

### RuoYi主要特性

1. 完全响应式布局（支持电脑、平板、手机等所有主流设备）
1. 强大的一键生成功能（包括控制器、模型、视图、菜单等）
1. 支持多数据源，简单配置即可实现切换。
1. 支持按钮及数据权限，可自定义部门数据权限。
1. 对常用js插件进行二次封装，使js代码变得简洁，更加易维护
1. 完善的XSS防范及脚本过滤，彻底杜绝XSS攻击
1. Maven多项目依赖，模块及插件分项目，尽量松耦合，方便模块升级、增减模块。
1. 国际化支持，服务端及客户端支持
1. 完善的日志记录体系简单注解即可实现
1. 缓存EhCache统一管理，支持快速切换为Redis缓存，集群Session缓存共享


## 演示图

<table>
    <tr>
        <td><img src="http://h5.sumslack.com/ruoyiplus/11.jpg"/></td>
        <td><img src="http://h5.sumslack.com/ruoyiplus/22.jpg"/></td>
    </tr>
    <tr>
        <td><img src="http://h5.sumslack.com/ruoyiplus/33.jpg"/></td>
        <td><img src="http://h5.sumslack.com/ruoyiplus/44.jpg"/></td>
    </tr>
    <tr>
        <td><img src="http://h5.sumslack.com/ruoyiplus/55.jpg"/></td>
        <td><img src="http://h5.sumslack.com/ruoyiplus/66.jpg"/></td>
    </tr>
    <tr>
        <td><img src="http://h5.sumslack.com/ruoyiplus/77.jpg"/></td>
        <td><img src="http://h5.sumslack.com/ruoyiplus/88.jpg"/></td>
    </tr>
</table>


