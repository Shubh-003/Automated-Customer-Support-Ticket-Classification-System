package com.example.supportdesk.security.jwt;

import com.example.supportdesk.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

//    Access token  ,  Refresh token
//    public String generateAccessToken(UserDetails user) {
//        return Jwts.builder()
//                .subject(user.getUsername())
//                .issuedAt(new Date())
//                .expiration(new Date(System.currentTimeMillis() + 900000)) // 15 min= 900000
//                .signWith(getKey())
//                .compact();
//    }

    public String generateAccessToken(User user) {

        return Jwts.builder()
//                .setSubject(user.getUsername())
                .subject(user.getUsername())
                .claim("role", user.getRole().name()) // add role claim for frontend
//                .setIssuedAt(new Date())
                .issuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + 900000))
                .expiration(new Date(System.currentTimeMillis() + 900000)) // 15 min= 900000
                .signWith(getKey())
                .compact();
    }
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isValid(String token, UserDetails user) {
        return extractUsername(token).equals(user.getUsername())
                && !isExpired(token);
    }

    private boolean isExpired(String token) {
        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getKey() {

        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT secret is not configured");
        }

        byte[] bytes = Decoders.BASE64.decode(secret);

        return Keys.hmacShaKeyFor(bytes);
    }
}



//Responsibilities:
//✔ Generate token
//✔ Validate token
//✔ Extract username