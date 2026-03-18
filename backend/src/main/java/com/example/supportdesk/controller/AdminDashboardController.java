package com.example.supportdesk.controller;

import com.example.supportdesk.dto.DashboardStats;
import com.example.supportdesk.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardStats getDashboard() {
        return dashboardService.getStats();
    }
}