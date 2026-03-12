/*
WebSocket configuration:
Enables STOMP messaging so backend can
push real-time updates to frontend.

User creates ticket
        ↓
Backend saves ticket
        ↓
Backend publishes WebSocket event
        ↓
All connected clients receive event
        ↓
React updates UI instantly
*/

package com.example.supportdesk.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {

        // topic clients can subscribe to
        config.enableSimpleBroker("/topic");

        // prefix for messages sent from client
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}