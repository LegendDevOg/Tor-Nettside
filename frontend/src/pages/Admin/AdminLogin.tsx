import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminLogin = () => {
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (pass === "letmein123") {
      localStorage.setItem("admin-token", pass);
      navigate("/admin");
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Admin Login</h1>
      <input
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        className="border px-3 py-2 w-full"
        placeholder="Enter password"
      />
      <button onClick={handleLogin} className="mt-4 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded transition-colors">
        Login
      </button>
    </div>
  );
};

export default AdminLogin;