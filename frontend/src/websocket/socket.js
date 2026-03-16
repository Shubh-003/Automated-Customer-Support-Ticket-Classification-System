/*
WebSocket connection service.

Connects frontend to Spring WebSocket
and listens for ticket events.
*/

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (onTicketReceived) => {

  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
  });

  stompClient.onConnect = () => {

    console.log("Connected to WebSocket");

    stompClient.subscribe("/topic/tickets", (message) => {

      const ticket = JSON.parse(message.body);

      onTicketReceived(ticket);
    });

  };

  stompClient.activate();

  // return disconnect function
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
};