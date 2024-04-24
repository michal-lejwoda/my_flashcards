import {useTranslation} from "react-i18next";
import {TextField} from "@mui/material";
import {useFormik} from "formik";
import {changeEmailValidation} from "../../validation.tsx";
import {changeEmail} from "../../api.tsx";
import {ChangeEmailError, ErrorResponse} from "../../interfaces.tsx";
import {useContext, useState} from "react";
import AuthContext from "../../context/AuthContext.tsx";

const ChangeEmail = () => {
    const {t} = useTranslation();
    const {token} = useContext(AuthContext);
    const [changeEmailError, setChangeEmailError] = useState<ChangeEmailError | null>(null)
    const [emailErrorSuccess, setEmailErrorSuccess] = useState<string | null>(null)
    const {values, handleChange, handleSubmit, errors} = useFormik({
        initialValues: {
            email: "", password: "",
        },
        validationSchema: changeEmailValidation,
        validateOnChange: false,
        onSubmit: () => {
            setChangeEmailError(null)
            setEmailErrorSuccess(null)
            handleChangeEmail()
        },
    });
    const handleChangeEmail = async () => {
        try {
            const changeEmailResponse = await changeEmail(values, token)
            if (changeEmailResponse && changeEmailResponse.message) {
                setEmailErrorSuccess(changeEmailResponse.message)
            }

        } catch (err: unknown) {
            const error = err as ErrorResponse
            setChangeEmailError(error.response.data)
        }
    }
    return (
        <div className="change_email">
            <h1 className="account__title">{t("change_email")}</h1>
            <div className="change_email__form">
                <form onSubmit={handleSubmit}>

                    <div className="account__form--textfield change_email__form--textfield">
                        <TextField
                            name="email"
                            type="email"
                            onChange={handleChange}
                            label={t("change_email")}
                            variant="outlined"
                            className="customTextField"
                            InputLabelProps={{
                                style: {color: '#fff'},
                            }}
                        />
                        <div className="errors form__errors">
                            {errors.email && <p className="form__error form__message">{errors.email}</p>}
                            {changeEmailError && changeEmailError.email &&
                                <p className="form__error form__message">{changeEmailError.email}</p>}
                        </div>
                    </div>

                    <div className="account__form--textfield change_email__form--textfield">
                        <TextField
                            name="password"
                            onChange={handleChange}
                            style={{borderColor: 'white'}}
                            id="outlined-basic"
                            type="password"
                            label={t("current_password")}
                            variant="outlined"
                            className="customTextField"
                            InputLabelProps={{
                                style: {color: '#fff'},
                            }}/>
                        <div className="errors form__errors">
                            {errors.password && <p className="form__error form__message">{errors.password}</p>}
                            {changeEmailError && changeEmailError.password &&
                                <p className="form__error form__message">{changeEmailError.password}</p>}
                            {emailErrorSuccess && <p className="form__success form__message">{emailErrorSuccess}</p>}
                        </div>
                    </div>
                    <button className="greenoutline--button" type="submit">
                        {t("update")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangeEmail;
