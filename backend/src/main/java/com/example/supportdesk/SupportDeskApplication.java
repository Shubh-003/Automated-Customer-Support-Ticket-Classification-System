
package com.example.supportdesk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class SupportDeskApplication {
    public static void main(String[] args) {
        SpringApplication.run(SupportDeskApplication.class, args);
    }
}
