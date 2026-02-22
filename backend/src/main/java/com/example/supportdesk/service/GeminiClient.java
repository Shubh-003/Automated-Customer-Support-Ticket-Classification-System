package com.example.supportdesk.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GeminiClient {

    private final WebClient webClient;

    @Value("${gemini.api-key}")
    private String apiKey;

    public GeminiClient() {
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent")
                .build();
    }

    public String classifyTicket(String description) {

        System.out.println("===== GEMINI DEBUG START =====");

        System.out.println("API KEY = " + apiKey);

        String prompt = """
You are a customer support ticket classifier.

Return ONLY one word:
Billing, Technical, Account, Feature, General.

Ticket:
%s
""".formatted(description);

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        try {

            Map response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("key", apiKey)
                            .build())
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(
                            status -> status.isError(),
                            res -> res.bodyToMono(String.class)
                                    .map(body -> new RuntimeException("HTTP ERROR: " + body))
                    )
                    .bodyToMono(Map.class)
                    .block();

            System.out.println("RAW RESPONSE = " + response);

            if (response == null) {
                System.out.println("RESPONSE IS NULL");
                return "General";
            }

            var candidates = (java.util.List<Map>) response.get("candidates");

            System.out.println("CANDIDATES = " + candidates);

            if (candidates == null || candidates.isEmpty()) {
                System.out.println("NO CANDIDATES");
                return "General";
            }

            var content = (Map) candidates.get(0).get("content");

            System.out.println("CONTENT = " + content);

            var parts = (java.util.List<Map>) content.get("parts");

            System.out.println("PARTS = " + parts);

            String result = parts.get(0).get("text").toString();

            System.out.println("FINAL TEXT = " + result);

            System.out.println("===== GEMINI DEBUG END =====");

            return result.replaceAll("[^A-Za-z]", "").trim();

        } catch (Exception e) {
            System.out.println("===== GEMINI ERROR =====");
            e.printStackTrace();
            return "General";
        }
    }


}
