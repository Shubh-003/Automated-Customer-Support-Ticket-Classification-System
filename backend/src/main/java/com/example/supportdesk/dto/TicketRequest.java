package com.example.supportdesk.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketRequest {

    @NotBlank
    private String subject;

    @NotBlank
    private String description;
}