import {createContext, useState} from 'react';
import {AuthContextType, Children} from "../interfaces.tsx";

const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: () => {
    }
});
export const AuthProvider = ({children}: Children) => {
    const [token, setToken] = useState<string | null>(null);
    return (
        <AuthContext.Provider value={{token, setToken}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
