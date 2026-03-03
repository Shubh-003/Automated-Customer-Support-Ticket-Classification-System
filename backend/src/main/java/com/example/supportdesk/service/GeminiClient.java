package com.example.supportdesk.service;

import com.example.supportdesk.dto.AiClassificationResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.time.Duration;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiClient {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api-key}")
    private String apiKey;

    private static final String PROMPT_TEMPLATE = """
You are an enterprise support ticket classifier.

Return ONLY valid JSON.
No explanation.
No markdown.
No extra text.

Format:
{
  "category": "BILLING | TECHNICAL | ACCOUNT | FEATURE | GENERAL",
  "priority": "LOW | MEDIUM | HIGH | CRITICAL",
  "confidence": 0.0 to 1.0
}

Ticket:
"%s"
""";

//    Constructor
    public GeminiClient() {

        this.webClient = WebClient.builder()
//                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent")
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent")
                .build();
    }

    /**
     * Calls Gemini API and returns structured classification result
     */
    public AiClassificationResult classifyTicket(String description) {

        String prompt = PROMPT_TEMPLATE.formatted(description);

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
                    .bodyToMono(Map.class)
                    .block();

            var candidates = (java.util.List<Map>) response.get("candidates");

            var content = (Map) candidates.get(0).get("content");

            var parts = (java.util.List<Map>) content.get("parts");

            String jsonText = parts.get(0).get("text").toString();

            return new ObjectMapper()
                    .readValue(jsonText, AiClassificationResult.class);

        } catch (Exception e) {
            return fallback();
        }
    }

    /**
     * Safe fallback (system never breaks)
     */
    private AiClassificationResult fallback() {

        AiClassificationResult r = new AiClassificationResult();

        r.setCategory("GENERAL");
        r.setPriority("LOW");
        r.setConfidence(0.5);

        return r;
    }

    /**
     * Parses AI JSON safely
     */
    private AiClassificationResult parseResult(String json) {

        try {
            return objectMapper.readValue(json, AiClassificationResult.class);
        } catch (Exception e) {

            System.err.println("===== JSON PARSE FAILED =====");
            System.err.println(json);
            e.printStackTrace();
            System.err.println("============================");

            return defaultResult();
        }
    }

    /**
     * Safe fallback (system never breaks)
     */
    private AiClassificationResult defaultResult() {

        AiClassificationResult result = new AiClassificationResult();

        result.setCategory("GENERAL");
        result.setPriority("LOW");
        result.setConfidence(0.0);

        return result;
    }
}