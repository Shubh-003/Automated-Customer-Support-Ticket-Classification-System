package com.example.supportdesk.security.service;

import com.example.supportdesk.entity.RefreshToken;
import com.example.supportdesk.entity.User;
import com.example.supportdesk.repository.RefreshTokenRepository;
import com.example.supportdesk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository repository;
    private final UserRepository userRepository;

    public RefreshToken createRefreshToken(String username){

        User user = userRepository.findByUsername(username)
                .orElseThrow();

        RefreshToken token = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .revoked(false)
                .build();

        return repository.save(token);
    }

    public RefreshToken verifyToken(String token){

        RefreshToken refreshToken =
                repository.findByToken(token)
                        .orElseThrow();

        if(refreshToken.isRevoked())
            throw new RuntimeException("Token revoked");

        if(refreshToken.getExpiryDate()
                .isBefore(Instant.now()))
            throw new RuntimeException("Token expired");

        return refreshToken;
    }

    public void revokeToken(String token){
        RefreshToken refreshToken =
                repository.findByToken(token)
                        .orElseThrow();

        refreshToken.setRevoked(true);
        repository.save(refreshToken);
    }
}
