package com.ruoyi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

import lombok.extern.slf4j.Slf4j;

/**
 * 启动程序
 * 
 * @author ruoyi
 */
@Slf4j
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class RuoYiApplication {
	public static void main(String[] args) {
		log.info("系统启动==========》begin");
		SpringApplication.run(RuoYiApplication.class, args);
		log.info("系统启动==========》end");
	}
}