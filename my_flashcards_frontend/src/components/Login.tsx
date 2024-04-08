import "../sass/login.css"
import {Form} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {postLogin} from "../api.tsx";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {validateLogin} from "../validation.tsx";
import {LoginValues} from "../interfaces.tsx";
import i18n from "i18next";

interface ErrorResponse {
    response: {
        data: {
            detail: string;
        };
    };
}

const Login = () => {
    const {t} = useTranslation();
    const [, setCookie] = useCookies(['flashcard_user_auth']);
    const navigate = useNavigate();
    const currentLanguage1 = i18n.language;
    console.log("crLanguage")
    console.log(currentLanguage1)
    // const currentLanguage = i18n.language;
    // console.log("currentLanguage")
    // console.log(currentLanguage)
    // console.log("t")
    // console.log(t)
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
            for (let i = 0; i < Object.keys(error.response.data).length; i++) {
                setFieldError(Object.keys(error.response.data)[i], Object.values(error.response.data)[i])
            }
        }
    }

    const {values, setFieldError, handleSubmit, handleChange, errors} = useFormik({
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
    console.log(values)
    console.log("errors")
    console.log(errors)
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
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>{t('password')}</Form.Label>
                        <Form.Control onChange={handleChange} name="password" type="password" placeholder="Password"/>
                        {errors.password && <p className="text-red-400">{errors.password}</p>}
                        {Array.isArray(errors.non_field_errors) && errors.non_field_errors.map((error, index) => (
                            <p key={index} className="text-red-400">{error}</p>
                        ))}
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
