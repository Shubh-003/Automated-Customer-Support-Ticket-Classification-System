package com.example.supportdesk.controller;

import com.example.supportdesk.audit.Auditable;
import com.example.supportdesk.dto.TicketRequest;
import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.service.TicketService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // ---------------- CREATE ----------------
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','AGENT','ADMIN')")
    @Auditable(action="CREATE", entity="TICKET")
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
    @Auditable(action="DELETE", entity="TICKET")
    public String deleteTicket(@PathVariable Long id) {

        ticketService.deleteTicket(id);
        return "Ticket deleted";
    }

//    ------ Update status --------
    @PutMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable Long id,@RequestBody Map<String,String> body){
        return ticketService.updateStatus(id, body.get("status"));
    }

//    -------- Search ticket ------
    @GetMapping("/search")
    public List<Ticket> searchTickets(@RequestParam String query) {

        return ticketService.searchTickets(query);

    }
}