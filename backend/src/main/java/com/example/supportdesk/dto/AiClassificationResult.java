package com.example.supportdesk.dto;

import lombok.Data;

//@Data
public class AiClassificationResult {

    private String category;

    private String priority;

    private Double confidence;

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }
}


// Create AI Response DTO : Never parse AI output as Map.