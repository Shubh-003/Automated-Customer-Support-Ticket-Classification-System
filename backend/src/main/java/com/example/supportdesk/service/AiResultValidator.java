package com.example.supportdesk.service;

import com.example.supportdesk.dto.AiClassificationResult;
import com.example.supportdesk.model.TicketCategory;
import com.example.supportdesk.model.TicketPriority;
import org.springframework.stereotype.Component;

@Component
public class AiResultValidator {

    public ValidatedResult validate(AiClassificationResult aiResult) {

        TicketCategory category =
                TicketCategory.from(aiResult.getCategory());

        TicketPriority priority =
                TicketPriority.from(aiResult.getPriority());

        double confidence = aiResult.getConfidence();

        if (confidence < 0 || confidence > 1) {
            confidence = 0.5; // neutral fallback
        }

        return new ValidatedResult(
                category,
                priority,
                confidence
        );
    }

    public record ValidatedResult(
            TicketCategory category,
            TicketPriority priority,
            double confidence
    ) {}
}


//Create Validator Service
//This is where production safety lives.

//👉 Now even if AI says:
//        "category": "HACKED"
//Your system converts → GENERAL.