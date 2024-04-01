import "../sass/login.css"
import {Form} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {postLogin} from "../api.tsx";
import {useState} from "react";
import {useCookies} from "react-cookie";
import { useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {validateLogin} from "../validation.tsx";
import {LoginValues} from "../interfaces.tsx";

interface ErrorResponse {
    response: {
        data: {
            detail: string;
        };
    };
}

const Login = () => {
    const {t} = useTranslation();
    const [errorlogin, ] = useState(null)
    const [, setCookie] = useCookies(['flashcard_user_auth']);
    const navigate = useNavigate();
    console.log(errorlogin)
    const handleLogin = async (values: LoginValues) => {
        const form = new FormData()
        form.append("username", values.username)
        form.append("password", values.password)
        try {
            const login_data = await postLogin(form)
            await setCookie('flashcard_user_auth', login_data.access_token, {'sameSite': 'lax'})
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
            console.log(error)
            // setErrorLogin(error.response.data.detail);
        }
    }
    const {values, handleSubmit, errors} = useFormik({
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
    console.log(values)
    console.log(errors)
    return (
        <div className="login">
            <h1>{t('login')}</h1>
            <div className="login__container">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>{t('username')}</Form.Label>
                        <Form.Control type="email" placeholder={t("enter_username")}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>{t('password')}</Form.Label>
                        <Form.Control type="password" placeholder="Password"/>
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
