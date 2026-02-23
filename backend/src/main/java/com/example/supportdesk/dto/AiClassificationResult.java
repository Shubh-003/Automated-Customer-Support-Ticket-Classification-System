package com.example.supportdesk.dto;

import lombok.Data;

@Data
public class AiClassificationResult {

    private String category;

    private String priority;

    private Double confidence;
}