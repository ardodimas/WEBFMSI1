/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getDataPrivate, logoutAPI } from "../utils/api";
import { jwtStorage } from "../utils/jwt_storage";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with your logic
  const [userProfile, setUserProfile] = useState({});
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);

  const navigate = useNavigate();

  const getDataProfile = async () => {
    await getDataPrivate("/api/profile")
      .then((resp) => {
        setIsLoadingScreen(false);
        if (resp?.role) {
          setUserProfile(resp);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => {
        setIsLoadingScreen(false);
        setIsLoggedIn(false);
        console.log(err);
      });
  };

  useEffect(() => {
    const checkTokenAndProfile = async () => {
      const token = await jwtStorage.retrieveToken();
      if (token) {
        getDataProfile();
      } else {
        setIsLoadingScreen(false);
        setIsLoggedIn(false);
      }
    };
    checkTokenAndProfile();
  }, []);

  const login = async (access_token) => {
    await jwtStorage.storeToken(access_token);
    
    // Ambil data profile terlebih dahulu
    try {
      const resp = await getDataPrivate("/api/profile");
      if (resp?.role) {
        setUserProfile(resp);
        setIsLoggedIn(true);
        
        // Redirect berdasarkan role
        if (resp.role === 'admin') {
          navigate("/katalog-admin", { replace: true });
        } else {
          navigate("/katalog", { replace: true });
        }
      } else {
        setIsLoggedIn(false);
        navigate("/login", { replace: true });
      }
    } catch (err) {
      setIsLoggedIn(false);
      console.log(err);
      navigate("/login", { replace: true });
    }
  };

  const logout = async () => {
    try {
      const resp = await logoutAPI();
      console.log("Logout response:", resp);
      
      // Jika logout berhasil atau gagal, tetap bersihkan state lokal
      jwtStorage.removeItem();
      setIsLoggedIn(false);
      setUserProfile({});
      // navigate("/login", { replace: true }); // HAPUS atau KOMENTARI baris ini
    } catch (err) {
      console.log("Logout error:", err);
      // Fallback: bersihkan state lokal meskipun API gagal
      jwtStorage.removeItem();
      setIsLoggedIn(false);
      setUserProfile({});
      // navigate("/login", { replace: true }); // HAPUS atau KOMENTARI baris ini
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        userProfile,
        isLoadingScreen,
        setIsLoadingScreen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
