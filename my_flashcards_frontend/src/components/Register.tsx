import {useTranslation} from "react-i18next";
import "../sass/register.css";
import {useFormik} from "formik";
import {validateRegistration} from "../validation.tsx";
import {ErrorResponse, RegisterError, RegisterValues} from "../interfaces.tsx";
import {postRegister} from "../api.tsx";
import {useCookies} from "react-cookie";
import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import AuthContext from "../context/AuthContext.tsx";
import withoutAuth from "../context/withoutAuth.tsx";
import GreenButton from "./elements/GreenButton.tsx";
import CenteredForm from "./elements/CenteredForm.tsx";
import InputField from "./elements/InputField.tsx";
import ErrorMessage from "./elements/errors/ErrorMessage.tsx";
import BackendErrorMessage from "./elements/errors/BackendErrorMessage.tsx";
import CenteredTitle from "./elements/CenteredTitle.tsx";

const Register = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [, setCookie] = useCookies(['flashcard_user_auth']);
    const [registerError, setRegisterError] = useState<RegisterError | null>(null)
    const auth = useContext(AuthContext);
    const {values, handleSubmit, handleChange, errors} = useFormik({
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
    const handleRegister = async (values: RegisterValues) => {
        const form = new FormData()
        form.append("username", values.username)
        form.append("email", values.email)
        form.append("password", values.password)
        form.append("password2", values.repeat_password)
        try {
            const register_data = await postRegister(form)
            if (register_data.token) {
                await setCookie('flashcard_user_auth', register_data.token, {'sameSite': 'lax'});
                auth.setToken(register_data.token)
                navigate("/");
            }
            // TODO Maybe Add some sort of exception
        } catch (err: unknown) {
            const error = err as ErrorResponse
            setRegisterError(error.response.data)
        }
    }

    return (
        <div className="register">
            <div className="register__image">
                <img src="/public/register_page.svg" alt=""/>
            </div>
            <div className="register__container__inputs">
            <CenteredTitle title={t('register')}/>
            <div className="register__container">
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
                            {registerError && registerError.username && (
                                <BackendErrorMessage message={registerError.username}/>
                            )}
                        </div>
                    </div>
                    <div className="account__form--textfield">
                        <InputField
                            label={t("email")}
                            name="email"
                            type="email"
                            handleChange={handleChange}
                            value={values.email}
                        />
                        <div className="errors form__errors">
                            {errors.email && <ErrorMessage message={errors.email}/>}
                            {registerError && registerError.email && (
                                <BackendErrorMessage message={registerError.email}/>
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
                            {registerError && registerError.password && (
                                <BackendErrorMessage message={registerError.password}/>
                            )}
                        </div>
                    </div>
                    <div className="account__form--textfield">
                        <InputField
                            label={t("repeat_password")}
                            name="repeat_password"
                            type="password"
                            handleChange={handleChange}
                            value={values.repeat_password}
                        />
                        <div className="errors form__errors">
                            {errors.repeat_password &&
                                <ErrorMessage message={errors.repeat_password}/>}
                            {registerError && registerError.repeat_password && (
                                <BackendErrorMessage message={registerError.repeat_password}/>
                            )}
                        </div>
                    </div>
                    <div className="account__button">
                        <GreenButton message={t("submit")}/>
                    </div>
                </CenteredForm>
            </div>
        </div>
        </div>
    );
};

export default withoutAuth(Register);
