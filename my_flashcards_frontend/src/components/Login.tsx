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
import withoutAuth from "../context/withoutAuth.tsx";
import {TextField} from "@mui/material";


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
                <Form className="login__form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <TextField
                            style={{borderColor: 'white'}}
                            id="outlined-basic"
                            variant="outlined"
                            className="customTextField"
                            InputLabelProps={{
                                style: {color: '#fff'},
                            }}
                            label={t("username")}
                            onChange={handleChange}
                            name="username"
                            type="text"
                        />
                        <div className="errors form__errors">
                            {errors.username && <p className="text-red-400">{errors.username}</p>}
                            {loginError && loginError.username && (
                                <p className="text-red-400">{loginError.username}</p>
                            )}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <TextField
                            style={{borderColor: 'white'}}
                            id="outlined-basic"
                            variant="outlined"
                            className="customTextField"
                            InputLabelProps={{
                                style: {color: '#fff'},
                            }}
                            label={t("password")}
                            onChange={handleChange}
                            name="password"
                            type="password"
                        />
                        <div className="errors form__errors">
                            {errors.password && <p className="form__error form__message">{errors.password}</p>}
                            {loginError && loginError.password && (
                                <p className="form__error form__message">{loginError.password}</p>
                            )}
                            {loginError && loginError.non_field_errors && (
                                <p className="form__error form__message">{loginError.non_field_errors}</p>
                            )}
                            </div>
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

export default withoutAuth(Login);
