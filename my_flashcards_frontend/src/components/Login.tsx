import "../sass/login.css"
import {Form} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {postLogin} from "../api.tsx";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {validateLogin} from "../validation.tsx";
import {LoginValues} from "../interfaces.tsx";
import {useState} from "react";

interface ErrorResponse {
    response: {
        data: Record<string, unknown>;
    };
}

interface LoginError {
    username?: string[];
    password?: string[];
    non_field_errors?: string[];
}

const Login = () => {
    const {t} = useTranslation();
    const [, setCookie] = useCookies(['flashcard_user_auth']);
    const [loginError, setLoginError] = useState<LoginError | null>(null)
    const navigate = useNavigate();
    const handleLogin = async (values: LoginValues) => {
        const form = new FormData()
        form.append("username", values.username)
        form.append("password", values.password)
        try {
            const login_data = await postLogin(form)
            await setCookie('flashcard_user_auth', login_data, {'sameSite': 'lax'})
            // await setCookie('flashcard_user_auth', login_data.access_token, {'sameSite': 'lax'})
            // try {
            //     let logged_user = await checkIfUserLogged()
            //     setAuthUser(logged_user)
            //     setIsLoggedIn(true)
            // } catch (err) {
            //     setAuthUser(null)
            //     setIsLoggedIn(false)
            // }
            await navigate("/");

        } catch (err: unknown) {
            const error = err as ErrorResponse
            setLoginError(error.response.data)
            // setLoginError(error.response.data)
            // for (let i = 0; i < Object.keys(error.response.data).length; i++) {
            //     setFieldError(Object.keys(error.response.data)[i], Object.values(error.response.data)[i])
            // }
        }
    }

    const {handleSubmit, handleChange, errors} = useFormik({
        initialValues: {
            username: '',
            password: '',
            non_field_errors: []
        },
        validationSchema: validateLogin,
        validateOnChange: false,
        onSubmit: values => {
            const {username, password} = values;
            const valuesToSend = {username, password};
            handleLogin(valuesToSend)
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
