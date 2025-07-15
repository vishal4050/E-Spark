import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const server = "http://localhost:5000"; // or use import.meta.env.VITE_SERVER_URL

    async function loginUser({ email, password, navigate,fetchMyCourse }) {
        setBtnLoading(true);
        toast.dismiss();

        try {
            const { data } = await axios.post(
                `${server}/api/user/login`,
                { email, password },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            toast.success(data.message);
            localStorage.setItem("token", data.token);
            setUser(data.user);
            setIsAuth(true);
            navigate("/");
            fetchMyCourse();
        } catch (error) {
            console.error("Login error:", error);
            setIsAuth(false);
            toast.error(error?.response?.data?.message || "Login failed", {
                id: "login-error"
            });
        } finally {
            setBtnLoading(false);
        }
    }
    
    async function registerUser({ name, email, password, navigate }) {
        setBtnLoading(true);
        toast.dismiss();
        try {
            const { data } = await axios.post(
                `${server}/api/user/register`,
                { name, email, password },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
            localStorage.setItem("activationToken", data.activationToken);
            navigate("/verify", { state: { message: data.message } });
        } catch (error) {
            console.error("Register error:", error);
            toast.error(error?.response?.data?.message || "Something went wrong", {
                id: "register-error"
            });
        } finally {
            setBtnLoading(false);
        }
    }

    async function verifyOtp(otp, navigate) {
        setBtnLoading(true);
        const activationToken = localStorage.getItem("activationToken")
        try {
            const { data } = await axios.post(
                `${server}/api/user/verify`,
                {
                    otp,
                    activationToken
                },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
           
            toast.success(data.message);
            navigate("/login");
            localStorage.clear(); 
            setBtnLoading(false);

        } catch (error) {
             setBtnLoading(false);
            toast.error(error?.response?.data?.message || "Something went wrong", {
                id: "verification-error"
            });
        }
    }

    async function fetchUser() {
        const token = localStorage.getItem("token");
        
        if (!token) {
            setLoading(false);
            setIsAuth(false);
            setUser(null);
            return;
        }

        try {
            const { data } = await axios.get(`${server}/api/user/me`, {
                headers: {
                    token: token  // Changed from Authorization Bearer to token
                }
            });

            setIsAuth(true);
            setUser(data.user);
        } catch (error) {
            console.log("User fetch error:", error);
            
            // If token is invalid, clear it
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem("token");
                toast.error("Session expired. Please login again.");
            }
            
            setIsAuth(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    // Logout function
    const logoutUser = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuth(false);
        toast.success("Logged out successfully");
    };

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
            value={{ 
                user, 
                setUser, 
                isAuth, 
                setIsAuth, 
                loginUser, 
                btnLoading, 
                loading, 
                registerUser,
                verifyOtp,
                fetchUser,
                logoutUser
            }}
        >
            {children}
            <Toaster />
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);