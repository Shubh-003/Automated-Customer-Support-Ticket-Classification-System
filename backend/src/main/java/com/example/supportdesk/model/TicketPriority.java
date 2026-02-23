package com.example.supportdesk.model;

public enum TicketPriority {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL;

    public static TicketPriority from(String value) {
        try {
            return TicketPriority.valueOf(value.toUpperCase());
        } catch (Exception e) {
            return LOW; // safe default
        }
    }
}


// this class is for validate Priority
//This ensures: No random string ever enters DB.