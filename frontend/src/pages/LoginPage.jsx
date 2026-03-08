import { useState } from "react";
import axios from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

function LoginPage(){

  const navigate = useNavigate();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try{

      const res = await axios.post("/auth/login",{
        username,
        password
      });

      localStorage.setItem(
        "accessToken",
        res.data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        res.data.refreshToken
      );

      navigate("/dashboard");

    }catch(err){
      alert("Invalid credentials");
    }
  };

  return(
    <div className="p-10">

      <h1 className="text-2xl mb-4">Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-64">

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

        <button className="bg-green-500 text-white p-2">
          Login
        </button>

      </form>

    </div>
  );
}

export default LoginPage;