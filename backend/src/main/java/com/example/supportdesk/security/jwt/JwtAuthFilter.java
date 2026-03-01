package com.example.supportdesk.security.jwt;

import com.example.supportdesk.security.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
    public class JwtAuthFilter extends OncePerRequestFilter {

        private final JwtService jwtService;
        private final CustomUserDetailsService userService;

        public JwtAuthFilter(
                JwtService jwtService,
                CustomUserDetailsService userService
        ){
            this.jwtService = jwtService;
            this.userService = userService;
        }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        System.out.println("Request: " + request.getServletPath());

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {

            String username = jwtService.extractUsername(token);

            System.out.println("Token: " + token);
            System.out.println("Username: " + username);

            if (username != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails user =
                        userService.loadUserByUsername(username);

                if (jwtService.isValid(token, user)) {

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    user, null, user.getAuthorities());

                    SecurityContextHolder.getContext()
                            .setAuthentication(auth);

                    System.out.println("JWT VALID: true");
                }
            }

        } catch (io.jsonwebtoken.ExpiredJwtException e) {

            System.out.println("JWT EXPIRED");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Access token expired");
            return;

        } catch (Exception e) {

            System.out.println("INVALID TOKEN");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token");
            return;
        }

        chain.doFilter(request, response);
    }
    }


