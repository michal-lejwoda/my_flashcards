import {useTranslation} from "react-i18next";
import {Form} from "react-bootstrap";
import "../sass/register.css";
import {useFormik} from "formik";
import {validateRegistration} from "../validation.tsx";
import {ErrorResponse, LoginValues, RegisterError} from "../interfaces.tsx";
import {postLogin} from "../api.tsx";
import {useCookies} from "react-cookie";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [, setCookie] = useCookies(['flashcard_user_auth']);
    const [registerError, setRegisterError] = useState<RegisterError | null>(null)
    const {handleSubmit, handleChange, errors} = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            repeat_password: '',
        },
        validationSchema: validateRegistration,
        validateOnChange: false,
        onSubmit: values => {
            handleRegister(values)
        },
    });
    const handleRegister = async (values: LoginValues) => {
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
            setRegisterError(error.response.data)
        }
    }


    return (
        <div className="register">
            <h1>{t('register')}</h1>
            <div className="register__container">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>{t('username')}</Form.Label>
                        <Form.Control onChange={handleChange} name="username" type="text"
                                      placeholder={t("enter_username")}/>
                        {errors.username && <p className="text-red-400">{errors.username}</p>}
                        {registerError && registerError.username && (
                            <p className="text-red-400">{registerError.username}</p>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>{t('email')}</Form.Label>
                        <Form.Control onChange={handleChange} name="email" type="email" placeholder={t("enter_email")}/>
                        {errors.email && <p className="text-red-400">{errors.email}</p>}
                        {registerError && registerError.email && (
                            <p className="text-red-400">{registerError.email}</p>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>{t('password')}</Form.Label>
                        <Form.Control onChange={handleChange} name="password" type="password"
                                      placeholder={t("password")}/>
                        {errors.password && <p className="text-red-400">{errors.password}</p>}
                        {registerError && registerError.password && (
                            <p className="text-red-400">{registerError.password}</p>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>{t('repeat_password')}</Form.Label>
                        <Form.Control onChange={handleChange} name="repeat_password" type="password"
                                      placeholder={t("repeat_password")}/>
                        {errors.repeat_password && <p className="text-red-400">{errors.repeat_password}</p>}
                        {registerError && registerError.repeat_password && (
                            <p className="text-red-400">{registerError.repeat_password}</p>
                        )}
                    </Form.Group>
                    <div className="register__submit">
                        <button className="greenoutline--button" type="submit">
                            {t("submit")}
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Register;
