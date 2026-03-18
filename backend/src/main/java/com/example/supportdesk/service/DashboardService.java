package com.example.supportdesk.service;

import com.example.supportdesk.dto.DashboardStats;
import com.example.supportdesk.repository.TicketRepository;
import com.example.supportdesk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public DashboardStats getStats() {

        long totalTickets = ticketRepository.count();
        long totalUsers = userRepository.count();

        Map<String, Long> categoryMap = convert(ticketRepository.countByCategory());
        Map<String, Long> statusMap = convert(ticketRepository.countByStatus());
        Map<String, Long> trendMap = convert(ticketRepository.dailyTrends());

        return new DashboardStats(
                totalTickets,
                totalUsers,
                categoryMap,
                statusMap,
                trendMap
        );
    }

    private Map<String, Long> convert(List<Object[]> data) {
        Map<String, Long> map = new HashMap<>();
        for (Object[] row : data) {
            map.put(row[0].toString(), (Long) row[1]);
        }
        return map;
    }
}