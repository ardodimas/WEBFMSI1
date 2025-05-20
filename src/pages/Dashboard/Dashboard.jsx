import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      // Kalau user belum login, redirect ke halaman login
      navigate("/");
    }
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h1>Halo, {user?.name || "Pengguna"}! Selamat datang di Dashboard</h1>
    </div>
  );
};

export default Dashboard;
