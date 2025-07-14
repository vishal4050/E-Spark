import { createContext, useContext, useState } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  async function loginUser({ email, password, navigate }) {
    setBtnLoading(true);
      toast.dismiss();
    try {
        const server = "http://localhost:5000"
     const { data } = await axios.post(
  `${server}/api/user/login`,
  { email, password },
  {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // If you're using cookies or sessions
  }
);
  
     
     

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setIsAuth(false);
 toast.error(error?.response?.data?.message || "Login failed", {
  id: `login-error-${Date.now()}` // unique every time
});
 
 
 
 
    } finally {
      setBtnLoading(false);
    }
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, setIsAuth, isAuth, loginUser, btnLoading }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
