package com.example.supportdesk.service;

import com.example.supportdesk.dto.*;
import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final GeminiClient geminiClient;

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

        AiClassificationResult result =
                geminiClient.classifyTicket(description);

        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow();

        ticket.setCategory(result.getCategory());
        ticket.setPriority(result.getPriority());
        ticket.setConfidence(result.getConfidence());
        ticket.setStatus("OPEN");

        ticketRepository.save(ticket);
    }
}