import {ComponentType, useContext, useEffect} from 'react';
import AuthContext from "./AuthContext.tsx";
import {useNavigate} from "react-router-dom";

const withoutAuth = <P extends object>(Component: ComponentType<P>) => {
    const WrappedComponent: React.FC<P> = (props) => {
        const {token} = useContext(AuthContext);
        const navigate = useNavigate();
        useEffect(() => {
            if (token) {
                navigate("/");
            }
        }, [token, navigate]);
        return !token ? <Component {...props} /> : null;
    };

    return WrappedComponent;
};

export default withoutAuth;
