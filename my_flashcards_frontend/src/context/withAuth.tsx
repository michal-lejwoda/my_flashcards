import {ComponentType, useContext, useEffect} from 'react';
import AuthContext from "./AuthContext.tsx";
import {useNavigate} from "react-router-dom";

const withAuth = <P extends object>(Component: ComponentType<P>) => {
    const WrappedComponent: React.FC<P> = (props) => {
        const {token, tokenLoading} = useContext(AuthContext);
        const navigate = useNavigate();
        useEffect(() => {
            if (!tokenLoading && !token) {
                navigate('/login');
            }
        }, [token]);
        return token ? <Component {...props} /> : null;
    };

    return WrappedComponent;
};

export default withAuth;
