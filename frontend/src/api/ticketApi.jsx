/*
Central place for all ticket-related backend calls. update status
*/

import axios from "./axiosClient";

export const getMyTickets = async () => {
  const res = await axios.get("/tickets/my");
  return res.data;
};

export const getAllTickets = async () => {
  const res = await axios.get("/tickets/all");
  return res.data;
};

export const updateTicketStatus = async (id, status) => {

  const res = await axios.put(`/tickets/${id}/status`, {
    status
  });

  return res.data;
};