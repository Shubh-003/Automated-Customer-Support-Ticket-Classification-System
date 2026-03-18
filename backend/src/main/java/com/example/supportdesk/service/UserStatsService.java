package com.example.supportdesk.service;

import com.example.supportdesk.dto.UserStatsDto;
import com.example.supportdesk.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserStatsService {

    private final TicketRepository ticketRepository;

    public List<UserStatsDto> getUserStats() {

        List<Object[]> rows = ticketRepository.userStats();

        return rows.stream()
                .map(r -> new UserStatsDto(
                        (String) r[0],
                        (Long) r[1],
                        (Long) r[2],
                        (Long) r[3]
                ))
                .toList();
    }
}