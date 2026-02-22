package com.example.supportdesk.controller;

import com.example.supportdesk.service.GeminiClient;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final GeminiClient geminiClient;

    public TestController(GeminiClient geminiClient) {
        this.geminiClient = geminiClient;
    }

    @GetMapping("/ai")
    public String testAi(@RequestParam String text) {
        return geminiClient.classifyTicket(text);
    }
}
