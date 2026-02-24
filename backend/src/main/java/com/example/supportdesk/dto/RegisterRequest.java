package com.example.supportdesk.dto;

public record RegisterRequest(
        String username,
        String password
) {}