package com.example.supportdesk.controller;


import com.example.supportdesk.dto.TicketRequest;
import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public Ticket create(@RequestBody @Valid TicketRequest request) {

        // Later: get from JWT
        String user = "demo_user";

        return ticketService.createTicket(request, user);
    }
}