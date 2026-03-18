package com.example.supportdesk.controller;

import com.example.supportdesk.dto.UserStatsDto;
import com.example.supportdesk.service.UserStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserStatsService userStatsService;

    @GetMapping
    public List<UserStatsDto> getUsers() {
        return userStatsService.getUserStats();
    }
}