package com.example.supportdesk.model;

public enum TicketCategory {
    BILLING,
    TECHNICAL,
    ACCOUNT,
    FEATURE,
    GENERAL;

    public static TicketCategory from(String value) {
        try {
            return TicketCategory.valueOf(value.toUpperCase());
        } catch (Exception e) {
            return GENERAL; // fallback
        }
    }
}



//This ensures: No random string ever enters DB.

// This class created to Add validation. This prevents bad AI responses from breaking DB.
//Before saving AI output, we will:
//✅ Validate category
//✅ Validate priority
//✅ Validate confidence
//✅ Auto-fallback if AI gives garbage
//✅ Prevent DB corruption
//✅ Make system production-safe