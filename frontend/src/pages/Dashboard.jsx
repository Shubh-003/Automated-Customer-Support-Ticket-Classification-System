import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard(){

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl mb-4">
        Dashboard - Welcome You are logged in..!
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2">
        Logout
      </button>

    </div>
  );
}

export default Dashboard;