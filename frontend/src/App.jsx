import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// import Dashboard from "./pages/Dashboard";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import UserDashboard from "./pages/user/UserDashboard";
import CreateTicket from "./pages/user/CreateTicket";
import MyTickets from "./pages/user/MyTickets";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTickets from "./pages/admin/AdminTickets";
import Users from "./pages/admin/Users";
import Categories from "./pages/admin/Categories";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/search" element={<ProtectedRoute><AdminTickets /></ProtectedRoute>} />

      {/* USER ROUTES */}
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              <Route path="create-ticket" element={<CreateTicket />} />
              <Route path="my-tickets" element={<MyTickets />} />
            </Route>

{/*             ADMIN ROUTES */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="tickets" element={<AdminTickets />} />
              <Route path="users" element={<Users />} />
              <Route path="Categories" element={<Categories />} />
            </Route>


    </Routes>
  );
}

export default App;