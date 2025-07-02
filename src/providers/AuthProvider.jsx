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
    getDataProfile();
    navigate("/costumes", { replace: true });
  };

  const logout = () => {
    logoutAPI()
      .then((resp) => {
        if (resp?.isLoggedOut) {
          jwtStorage.removeItem();
          setIsLoggedIn(false);
          navigate("/login", { replace: true });
        }
      })
      .catch((err) => console.log(err));
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
