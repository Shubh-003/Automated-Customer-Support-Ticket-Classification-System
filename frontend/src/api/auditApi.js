import axios from "./axiosClient";

export const getAuditLogs = async () => {
  const res = await axios.get("/admin/audit");
  return res.data;
};