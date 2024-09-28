import { createContext, useCallback, useState, useEffect } from "react";
import { postRequest } from "../utils/services";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setisRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email:"",
    password: ""
  });


  useEffect(()=>{
    const user = localStorage.getItem("user");
    if (!user) return;
    setUser(JSON.parse(user))
  }, []);


  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const registerUser = useCallback(async (e) => {
    e.preventDefault(); // preventing page refreshing on form submit;
    setRegisterError(null);
    setisRegisterLoading(true)
    const response = await postRequest("/users/register", JSON.stringify(registerInfo));
    if (response.error) {
        setRegisterError(response);
        setisRegisterLoading(false);
        return;
    }
    setUser(response);
    localStorage.setItem("user", JSON.stringify(response));
    setRegisterError(null);
    setisRegisterLoading(false);
  }, [registerInfo]);

  return (
    <AuthContext.Provider
      value={{
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
