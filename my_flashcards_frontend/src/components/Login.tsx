import "../sass/login.css"
import {Form} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {postLogin} from "../api.tsx";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {validateLogin} from "../validation.tsx";
import {ErrorResponse, LoginError, LoginValues} from "../interfaces.tsx";
import {useContext, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";


const Login = () => {
    const {t} = useTranslation();
    const [, setCookie] = useCookies(['flashcard_user_auth']);
    const [loginError, setLoginError] = useState<LoginError | null>(null)
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const handleLogin = async (values: LoginValues) => {
        const form = new FormData()
        form.append("username", values.username)
        form.append("password", values.password)
        try {
            const login_data = await postLogin(form)
            if (login_data.data && login_data.data.token) {
                await setCookie('flashcard_user_auth', login_data.data.token, {'sameSite': 'lax'});
                auth.setToken(login_data.data.token)
                await navigate("/");
            }

        } catch (err: unknown) {
            const error = err as ErrorResponse
            setLoginError(error.response.data)
        }
    }

    const {handleSubmit, handleChange, errors} = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validateLogin,
        validateOnChange: false,
        onSubmit: values => {
            handleLogin(values)
        },
    });
    return (
        <div className="login">
            <h1>{t('login')}</h1>
            <div className="login__container">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>{t('username')}</Form.Label>
                        <Form.Control onChange={handleChange} name="username" type="text"
                                      placeholder={t("enter_username")}/>
                        {errors.username && <p className="text-red-400">{errors.username}</p>}
                        {loginError && loginError.username && (
                            <p className="text-red-400">{loginError.username}</p>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>{t('password')}</Form.Label>
                        <Form.Control onChange={handleChange} name="password" type="password" placeholder="Password"/>
                        {errors.password && <p className="text-red-400">{errors.password}</p>}
                        {loginError && loginError.password && (
                            <p className="text-red-400">{loginError.password}</p>
                        )}
                        {loginError && loginError.non_field_errors && (
                            <p className="text-red-400">{loginError.non_field_errors}</p>
                        )}
                    </Form.Group>
                    <div className="login__submit">
                        <button className="greenoutline--button" type="submit">
                            {t("submit")}
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;
