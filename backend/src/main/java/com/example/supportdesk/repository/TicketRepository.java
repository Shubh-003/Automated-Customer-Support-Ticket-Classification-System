package com.example.supportdesk.repository;

import com.example.supportdesk.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedBy(String createdBy);

    List<Ticket> findByStatus(String status);

    @Query("""
    SELECT t FROM Ticket t
    WHERE CAST(t.id AS string) LIKE CONCAT('%', :query, '%')
       OR LOWER(t.subject) LIKE LOWER(CONCAT('%', :query, '%'))
       OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%'))
       OR LOWER(CAST(t.category AS string)) LIKE LOWER(CONCAT('%', :query, '%'))
       OR LOWER(CAST(t.status AS string)) LIKE LOWER(CONCAT('%', :query, '%'))
       OR LOWER(t.createdBy) LIKE LOWER(CONCAT('%', :query, '%'))
    """)
    List<Ticket> searchTickets(@Param("query") String query);

//    DashboardStat Queries
    @Query("SELECT t.category, COUNT(t) FROM Ticket t GROUP BY t.category")
    List<Object[]> countByCategory();

    @Query("SELECT t.status, COUNT(t) FROM Ticket t GROUP BY t.status")
    List<Object[]> countByStatus();

    @Query("""
    SELECT DATE(t.createdAt), COUNT(t)
    FROM Ticket t
    GROUP BY DATE(t.createdAt)
    ORDER BY DATE(t.createdAt)
    """)
    List<Object[]> dailyTrends();

//    Users tab admin
    @Query("""
    SELECT t.createdBy,
       COUNT(t),
       SUM(CASE WHEN t.status IN ('RESOLVED','CLOSED') THEN 1 ELSE 0 END),
       SUM(CASE WHEN t.status IN ('OPEN','IN_PROGRESS') THEN 1 ELSE 0 END)
    FROM Ticket t
    GROUP BY t.createdBy
    """)
    List<Object[]> userStats();
}