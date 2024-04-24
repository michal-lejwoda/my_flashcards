import {useTranslation} from "react-i18next";
import {Form} from "react-bootstrap";
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
import {TextField} from "@mui/material";

const Register = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [, setCookie] = useCookies(['flashcard_user_auth']);
    const [registerError, setRegisterError] = useState<RegisterError | null>(null)
    const auth = useContext(AuthContext);
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
    const handleRegister = async (values: RegisterValues) => {
        const form = new FormData()
        form.append("username", values.username)
        form.append("email", values.email)
        form.append("password", values.password)
        form.append("password2", values.repeat_password)
        try {
            const register_data = await postRegister(form)
            if (register_data.data && register_data.data.token) {
                await setCookie('flashcard_user_auth', register_data.data.token, {'sameSite': 'lax'});
                auth.setToken(register_data.data.token)
                await navigate("/");
            }
            // TODO Maybe Add some sort of exception
        } catch (err: unknown) {
            const error = err as ErrorResponse
            setRegisterError(error.response.data)
        }
    }


    return (
        <div className="register">
            <h1>{t('register')}</h1>
            <div className="register__container">
                <Form className="register__form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <TextField
                            style={{borderColor: 'white'}}
                            id="outlined-basic"
                            variant="outlined"
                            className="customTextField"
                            InputLabelProps={{
                                style: {color: '#fff'},
                            }}
                            label={t("username")}
                            onChange={handleChange} name="username" type="text"
                        />
                        <div className="errors form__errors">
                            {errors.username && <p className="form__error form__message">{errors.username}</p>}
                            {registerError && registerError.username && (
                                <p className="form__error form__message">{registerError.username}</p>
                            )}
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <TextField
                            style={{borderColor: 'white'}}
                            id="outlined-basic"
                            variant="outlined"
                            className="customTextField"
                            InputLabelProps={{
                                style: {color: '#fff'},
                            }}
                            label={t("email")}
                            onChange={handleChange} name="email" type="email"/>
                        <div className="errors form__errors">
                            {errors.email && <p className="form__error form__message">{errors.email}</p>}
                            {registerError && registerError.email && (
                                <p className="form__error form__message">{registerError.email}</p>
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
                            onChange={handleChange} name="password" type="password"
                        />
                        <div className="errors form__errors">
                            {errors.password && <p className="form__error form__message">{errors.password}</p>}
                            {registerError && registerError.password && (
                                <p className="form__error form__message">{registerError.password}</p>
                            )}
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicRepeatPassword">
                        <TextField
                            style={{borderColor: 'white'}}
                            id="outlined-basic"
                            variant="outlined"
                            className="customTextField"
                            InputLabelProps={{
                                style: {color: '#fff'},
                            }}
                            label={t("repeat_password")}
                            onChange={handleChange} name="repeat_password" type="password"
                        />
                        <div className="errors form__errors">
                            {errors.repeat_password &&
                                <p className="form__error form__message">{errors.repeat_password}</p>}
                            {registerError && registerError.repeat_password && (
                                <p className="form__error form__message">{registerError.repeat_password}</p>
                            )}
                        </div>
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

export default withoutAuth(Register);
