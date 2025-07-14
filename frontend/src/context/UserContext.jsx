import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [Loading, setLoading] = useState(true);
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
    async function fetchUser() {
        try {
            const server = "http://localhost:5000"
            const { data } = await axios.get(`${server}/api/user/me`, {headers: {
                token: localStorage.getItem("token"),
            },
        });
          setIsAuth(true);
          setUser(data.user);
          setLoading(false);
        }
        catch (error) {
            setLoading(false);
            console.log(error);

        }
    }
   useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    fetchUser();
  } else {
    setLoading(false);
    setIsAuth(false);
    setUser(null);
  }
}, []);
   useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    fetchUser();
  } else {
    setLoading(false);
    setIsAuth(false);
    setUser(null);
  }
}, []);
   useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    fetchUser();
  } else {
    setLoading(false);
    setIsAuth(false);
    setUser(null);
  }
}, []);
    return (
        <UserContext.Provider
            value={{ user, setUser, setIsAuth, isAuth, loginUser, btnLoading,Loading}}
        >
            {children}
            <Toaster />
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);
