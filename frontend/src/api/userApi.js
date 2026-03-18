import axios from "./axiosClient";

export const getUserStats = async () => {
  const res = await axios.get("/admin/users");
  return res.data;
};