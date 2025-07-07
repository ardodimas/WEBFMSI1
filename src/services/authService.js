// src/services/authService.js
import axios from "axios";

const API_BASE = "http://localhost:8052/api/users"; //alamat backend

export const loginUser = async (email, password) => {
  try {
    const response = await axios.get(API_BASE);
    const users = response.data;

    const matchedUser = users.find(
      (user) => user.email === email && user.password_hash === password
    );

    if (matchedUser) {
      return { success: true, user: matchedUser };
    } else {
      return { success: false, message: "Email atau password salah" };
    }
  } catch (error) {
    return { success: false, message: "Terjadi kesalahan server" };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("user"); // Hapus data user
};