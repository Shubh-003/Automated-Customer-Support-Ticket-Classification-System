package com.example.supportdesk.controller;

import com.example.supportdesk.dto.TicketRequest;
import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.service.TicketService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // ---------------- CREATE ----------------
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','AGENT','ADMIN')")
    public Ticket create(
            @RequestBody @Valid TicketRequest request,
            Authentication authentication) {

        String username = authentication.getName();

        return ticketService.createTicket(request, username);
    }

    // ---------------- VIEW OWN ----------------
    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public List<Ticket> getMyTickets(Authentication authentication) {

        String username = authentication.getName();

        return ticketService.getMyTickets(username);
    }

    // ---------------- VIEW ALL ----------------
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('AGENT','ADMIN')")
    public List<Ticket> getAllTickets() {

        return ticketService.getAllTickets();
    }

    // ---------------- DELETE ----------------
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteTicket(@PathVariable Long id) {

        ticketService.deleteTicket(id);
        return "Ticket deleted";
    }
}