import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt", token);
      const decoded = decodeJwt(token);

      if (decoded && setAuth) {
        setAuth({ token, user: decoded });

        if (decoded.role === "admin") navigate("/admin");
        else navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [location, navigate, setAuth]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white">Authenticating...</p>
    </div>
  );
};

