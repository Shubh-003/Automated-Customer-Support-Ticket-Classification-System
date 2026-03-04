package com.example.supportdesk.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String role;

    private String action;

    private String entityName;

    private String entityId;

    private String ipAddress;

    private String status; // SUCCESS / FAILED

    private Instant timestamp;
}
