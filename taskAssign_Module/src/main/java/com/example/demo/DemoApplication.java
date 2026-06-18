package com.example.demo;

import org.springframework.amqp.core.Queue; // 导入 RabbitMQ 的 Queue
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean; // 导入 Bean
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    public Queue taskQueue() {
        
        return new Queue("task_queue", true);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
