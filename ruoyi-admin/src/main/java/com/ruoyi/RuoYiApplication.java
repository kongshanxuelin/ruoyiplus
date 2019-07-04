package com.ruoyi;

import com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceAutoConfigure;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import lombok.extern.slf4j.Slf4j;

import static org.reflections.Reflections.log;

/**
 * 启动程序
 * 
 * @author ruoyi
 */
@Slf4j
@SpringBootApplication(exclude = { DruidDataSourceAutoConfigure.class })
public class RuoYiApplication {
	public static void main(String[] args) {
		log.info("系统启动==========》begin");
		SpringApplication.run(RuoYiApplication.class, args);
		log.info("系统启动==========》end");
	}
}