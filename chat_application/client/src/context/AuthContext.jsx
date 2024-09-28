import { createContext, useCallback, useState, useEffect } from "react";
import { postRequest } from "../utils/services";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setisLoginLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setisRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;
    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault(); // preventing page refreshing on form submit;
      setRegisterError(null);
      setisRegisterLoading(true);
      const response = await postRequest(
        "/users/register",
        JSON.stringify(registerInfo)
      );
      if (response.error) {
        setRegisterError(response);
        setisRegisterLoading(false);
        return;
      }
      setUser(response);
      localStorage.setItem("user", JSON.stringify(response));
      setRegisterError(null);
      setisRegisterLoading(false);
    },
    [registerInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    setLoginInfo({ email: "", password: "" });
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setisLoginLoading(true);
      setLoginError(null);
      const response = await postRequest(
        "/users/login",
        JSON.stringify(loginInfo)
      );
      if (response.error) {
        setLoginError(response);
        setisLoginLoading(false);
        return;
      }
      setUser(response);
      localStorage.setItem("user", JSON.stringify(response));
      setLoginError(null);
      setisLoginLoading(false);
    },
    [loginInfo]
  );

  return (
    <AuthContext.Provider
      value={{
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        user,
        loginInfo,
        logoutUser,
        isLoginLoading,
        loginError,
        updateLoginInfo,
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
