package com.example.supportdesk.audit;

import com.example.supportdesk.entity.AuditLog;
import com.example.supportdesk.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogRepository repository;

    @Around("@annotation(auditable)")
    public Object auditMethod(
            ProceedingJoinPoint joinPoint,
            Auditable auditable) throws Throwable {

        Authentication auth =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        String username = auth != null ? auth.getName() : "SYSTEM";

        String role = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority()
                : "NONE";

        HttpServletRequest request =
                ((ServletRequestAttributes)
                        RequestContextHolder.getRequestAttributes())
                        .getRequest();

        String ip = request.getRemoteAddr();

        AuditLog log = AuditLog.builder()
                .username(username)
                .role(role)
                .action(auditable.action())
                .entityName(auditable.entity())
                .ipAddress(ip)
                .timestamp(Instant.now())
                .build();

        try {
            Object result = joinPoint.proceed();
            log.setStatus("SUCCESS");
            repository.save(log);
            return result;
        } catch (Exception ex) {
            log.setStatus("FAILED");
            repository.save(log);
            throw ex;
        }
    }
}