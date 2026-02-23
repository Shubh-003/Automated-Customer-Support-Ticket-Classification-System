package com.example.supportdesk.service;

import com.example.supportdesk.dto.*;
import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final GeminiClient geminiClient;
    private final AiResultValidator validator;

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

        return ticket;
    }

    @Async
    public void classifyAsync(Long ticketId, String description) {
//
        // 1️⃣ Call AI
        AiClassificationResult aiResult =
                geminiClient.classifyTicket(description);

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
}