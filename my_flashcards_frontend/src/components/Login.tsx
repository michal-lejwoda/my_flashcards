import "../sass/login.css"
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
import CenteredTitle from "./elements/CenteredTitle.tsx";
import InputField from "./elements/InputField.tsx";
import CenteredForm from "./elements/CenteredForm.tsx";
import ErrorMessage from "./elements/errors/ErrorMessage.tsx";
import BackendErrorMessage from "./elements/errors/BackendErrorMessage.tsx";
import GreenButton from "./elements/GreenButton.tsx";


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

    const {values, handleSubmit, handleChange, errors} = useFormik({
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
            <CenteredTitle title={t('login')}/>
            <div className="login__container">
                <CenteredForm handleSubmit={handleSubmit}>
                    <div className="account__form--textfield">
                        <InputField
                            label={t("username")}
                            name="username"
                            type="text"
                            handleChange={handleChange}
                            value={values.username}
                        />
                        <div className="errors form__errors">
                            {errors.username && <ErrorMessage message={errors.username}/>}
                            {loginError && loginError.username && (
                                <BackendErrorMessage message={loginError.username}/>
                            )}
                        </div>
                    </div>
                    <div className="account__form--textfield">
                        <InputField
                            label={t("password")}
                            name="password"
                            type="password"
                            handleChange={handleChange}
                            value={values.password}
                        />
                        <div className="errors form__errors">
                            {errors.password && <ErrorMessage message={errors.password}/>}
                            {loginError && loginError.password && (
                                <BackendErrorMessage message={loginError.password}/>
                            )}
                            {loginError && loginError.non_field_errors && (
                                <BackendErrorMessage message={loginError.non_field_errors}/>
                            )}
                        </div>
                    </div>
                    <div className="account__button">
                        <GreenButton message={t("submit")}/>
                    </div>
                </CenteredForm>
            </div>
        </div>
    );
};

export default withoutAuth(Login);
