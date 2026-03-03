package com.example.supportdesk.controller;

import com.example.supportdesk.dto.*;
import com.example.supportdesk.entity.RefreshToken;
import com.example.supportdesk.entity.User;
import com.example.supportdesk.model.Role;
import com.example.supportdesk.repository.UserRepository;
import com.example.supportdesk.security.jwt.JwtService;
import com.example.supportdesk.security.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;   // Inject JWT service
    private final RefreshTokenService refreshTokenService;

    // ---------------- REGISTER ----------------
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        if (userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER) // by default ROLE USER at public register endpoint
                .build();

        userRepository.save(user);

        return "User registered";
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {

        User user = userRepository
                .findByUsername(request.username())
                .orElseThrow(() ->
                        new RuntimeException("Invalid username or password")
                );

        // Check password
        boolean matches =
                passwordEncoder.matches(
                        request.password(),
                        user.getPassword()
                );

        if (!matches) {
            throw new RuntimeException("Invalid username or password");
        }

        // ✅ Convert User → UserDetails
        UserDetails userDetails =
                new org.springframework.security.core.userdetails.User(
                        user.getUsername(),
                        user.getPassword(),
                        List.of(
                                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                        )
                );

        // ✅ Generate JWT
//        String token = jwtService.generateToken(userDetails);

        // ✅ Return JSON
        String accessToken = jwtService.generateAccessToken(userDetails);

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());

        return Map.of(
//                "token", token,
                "accessToken", accessToken,
                "refreshToken", refreshToken.getToken()
        );
    }

//    refreshTokenService
@PostMapping("/refresh")
public Map<String, String> refreshToken(
        @RequestBody Map<String,String> request){

    String requestToken = request.get("refreshToken");

    RefreshToken refreshToken =
            refreshTokenService.verifyToken(requestToken);

    User user = refreshToken.getUser();

    UserDetails userDetails =
            new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    List.of(
                            new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                    )
            );

    String newAccessToken =
            jwtService.generateAccessToken(userDetails);

//  Token Rotation (Advanced Security)
    refreshTokenService.revokeToken(requestToken);

    RefreshToken newRefresh =
            refreshTokenService.createRefreshToken(user.getUsername());

    return Map.of(
            "accessToken", newAccessToken,
            "refreshToken", newRefresh.getToken()
    );
}

//    Logout Endpoint
@PostMapping("/logout")
public String logout(@RequestBody Map<String,String> request){

    refreshTokenService.revokeToken(
            request.get("refreshToken"));

    return "Logged out";
}

}