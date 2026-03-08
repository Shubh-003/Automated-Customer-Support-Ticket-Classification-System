import { useState } from "react";
import axios from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

function RegisterPage() {

  const navigate = useNavigate();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.post("/auth/register",{
        username,
        password
      });

      alert("User registered");
      navigate("/login");

    } catch(err){
      alert("Registration failed");
    }
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl mb-4">Register</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">

        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          className="border p-2"
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="border p-2"
        />

        <button className="bg-blue-500 text-white p-2">
          Register
        </button>

      </form>
    </div>
  );
}

export default RegisterPage;