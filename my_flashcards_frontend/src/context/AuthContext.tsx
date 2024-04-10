import {createContext, useEffect, useState} from 'react';
import {AuthContextType, Children} from "../interfaces.tsx";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: () => {
    }
});
export const AuthProvider = ({children}: Children) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [cookie] = useCookies(['flashcard_user_auth']);
    useEffect(()=>{
        if(cookie.flashcard_user_auth){
            setToken(cookie.flashcard_user_auth)
        }
        else{
            navigate("/login")
        }
    },[])
    return (
        <AuthContext.Provider value={{token, setToken}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
