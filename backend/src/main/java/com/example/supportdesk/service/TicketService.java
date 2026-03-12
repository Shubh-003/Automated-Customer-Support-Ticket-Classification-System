package com.example.supportdesk.service;

import com.example.supportdesk.dto.*;
import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final GeminiClient geminiClient;
    private final AiResultValidator validator;
    private final SimpMessagingTemplate messagingTemplate; // for auto refresh

    public Ticket createTicket(TicketRequest request, String user) {

        Ticket ticket = Ticket.builder()
                .subject(request.getSubject())
                .description(request.getDescription())
                .status("PENDING")
                .createdBy(user)
                .createdAt(LocalDateTime.now())
                .build();

        ticket = ticketRepository.save(ticket);

        classifyAsync(ticket.getId(), request.getDescription());

        // broadcast new ticket event
        messagingTemplate.convertAndSend(
                "/topic/tickets",
                ticket
        );

        return ticket;
    }

    @Async
    public void classifyAsync(Long ticketId, String description) {
//
        // 1️⃣ Call AI
        System.out.println("Calling Gemini...");
        AiClassificationResult aiResult =
                geminiClient.classifyTicket(description);
        System.out.println("Gemini Response: " + aiResult);

        // 2️⃣ Validate AI Output
        AiResultValidator.ValidatedResult validated =
                validator.validate(aiResult);

        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow();

        // 4️⃣ Apply Safe Values
        ticket.setCategory(validated.category());
        ticket.setPriority(validated.priority());
        ticket.setConfidence(validated.confidence());
        ticket.setStatus("OPEN");


        ticketRepository.save(ticket);
    }

    public List<Ticket> getMyTickets(String username){
        return ticketRepository.findByCreatedBy(username);
    }

    public List<Ticket> getAllTickets(){
        return ticketRepository.findAll();
    }

    public void deleteTicket(Long id){
        ticketRepository.deleteById(id);
    }

    public Ticket updateStatus(Long id, String status) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getTicketsByStatus(String status){
        return ticketRepository.findByStatus(status);
    }
}