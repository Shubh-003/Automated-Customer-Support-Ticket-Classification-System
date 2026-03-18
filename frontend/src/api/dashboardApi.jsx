import axios from "./axiosClient";

export const getDashboardStats = async () => {
  const res = await axios.get("/admin/dashboard");
  return res.data;
};