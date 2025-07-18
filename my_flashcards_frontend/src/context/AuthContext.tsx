import {createContext, useEffect, useState} from 'react';
import {AuthContextType, Children} from "../interfaces.tsx";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: () => {
    },
    tokenLoading: true
});
export const AuthProvider = ({children}: Children) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [cookie] = useCookies(['flashcard_user_auth']);
    const [tokenLoading, setTokenLoading] = useState(true)
    useEffect(()=>{
        const isPublicPath = location.pathname.startsWith("/exercises") || location.pathname.startsWith("/exercise");

        if (cookie.flashcard_user_auth) {
            setToken(cookie.flashcard_user_auth);
        } else if (!isPublicPath) {
            navigate("/login");
        }

        setTokenLoading(false);
    },[])

    return (
        <AuthContext.Provider value={{token, setToken, tokenLoading}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
