package com.example.supportdesk.dto;

public record UserStatsDto(
        String username,
        long totalTickets,
        long resolvedTickets,
        long unresolvedTickets
) {}
