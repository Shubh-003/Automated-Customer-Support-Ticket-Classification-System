package com.example.supportdesk.dto;

import java.util.Map;

public record DashboardStats(
        long totalTickets,
        long totalUsers,
        Map<String, Long> ticketsByCategory,
        Map<String, Long> ticketsByStatus,
        Map<String, Long> dailyTrends
) {}