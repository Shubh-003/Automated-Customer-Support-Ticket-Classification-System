package com.example.supportdesk.security;

import com.example.supportdesk.security.jwt.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.supportdesk.security.CustomAccessDeniedHandler;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter filter;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(JwtAuthFilter filter,CustomAccessDeniedHandler accessDeniedHandler)
    {
        this.filter = filter;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    SecurityFilterChain chain(HttpSecurity http)
            throws Exception {

        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s ->
                        s.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/actuator/health"
                        ).permitAll()
                        .requestMatchers(
                                "/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex ->
                        ex.accessDeniedHandler(accessDeniedHandler)
                )
                .addFilterBefore(
                        filter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .build();
    }

    @Bean
    PasswordEncoder encoder(){
        return new BCryptPasswordEncoder();
    }

// RoleHierarchy Bean
@Bean
public RoleHierarchy roleHierarchy() {

    RoleHierarchyImpl hierarchy = new RoleHierarchyImpl();

    hierarchy.setHierarchy("""
        ROLE_ADMIN > ROLE_AGENT
        ROLE_AGENT > ROLE_USER
    """);

    return hierarchy;
}
}