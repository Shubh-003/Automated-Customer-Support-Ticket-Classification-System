package com.example.supportdesk.dto;

public record LoginRequest(
        String username,
        String password
) {}