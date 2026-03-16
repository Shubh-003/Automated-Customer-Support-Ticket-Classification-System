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
}