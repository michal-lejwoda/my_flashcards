import {useTranslation} from "react-i18next";
import {TextField} from "@mui/material";
import {NavLink} from "react-router-dom";
import {useContext, useState} from "react";
import AuthContext from "../../context/AuthContext.tsx";
import {ChangePasswordError, ErrorResponse} from "../../interfaces.tsx";
import {useFormik} from "formik";
import {changePasswordValidation} from "../../validation.tsx";
import {changePassword} from "../../api.tsx";

const ChangePassword = () => {
    const {t} = useTranslation();
    const {token} = useContext(AuthContext);
    const [changePasswordError, setChangePasswordError] = useState<ChangePasswordError | null>(null)
    const [passwordErrorSuccess, setPasswordErrorSuccess] = useState<string | null>(null)
    const {values, handleChange, handleSubmit, errors} = useFormik({
        initialValues: {
            old_password: "", new_password: "",
        },
        validationSchema: changePasswordValidation,
        validateOnChange: false,
        onSubmit: () => {
            setChangePasswordError(null)
            setPasswordErrorSuccess(null)
            handleChangePassword()
        },
    });
    const handleChangePassword = async () => {
        try {
            const changeEmailResponse = await changePassword(values, token)
            if (changeEmailResponse && changeEmailResponse.message) {
                setPasswordErrorSuccess(changeEmailResponse.message)
            }
        } catch (err: unknown) {
            const error = err as ErrorResponse
            setChangePasswordError(error.response.data)
        }
    }


    return (
        <div className="change_password">
            <h1 className="account__title">{t("change_password")}</h1>
            <form onSubmit={handleSubmit}>
                <div className="change_password__form">
                    <div className="account__form--textfield change_password__form--textfield">
                        <TextField
                            name="old_password"
                            type="password"
                            onChange={handleChange}
                            style={{borderColor: 'white'}}
                            id="outlined-basic"
                            label={t("current_password")}
                            variant="outlined"
                            className="customTextField"
                            InputLabelProps={{
                                style: {color: '#fff'},
                            }}/>
                        <div className="errors form__errors">
                            {errors.old_password && <p className="form__error form__message">{errors.old_password}</p>}
                            {changePasswordError && changePasswordError.old_password &&
                                <p className="form__error form__message">{changePasswordError.old_password}</p>}
                        </div>
                    </div>
                    <div className="account__form--textfield change_password__form--textfield">
                        <TextField
                            name="new_password"
                            type="password"
                            onChange={handleChange}
                            style={{borderColor: 'white'}}
                            id="outlined-basic"
                            label={t("new_password")}
                            variant="outlined"
                            className="customTextField"
                            InputLabelProps={{
                                style: {color: '#fff'},
                            }}/>
                        <div className="errors form__errors">
                            {errors.new_password && <p className="form__error form__message">{errors.new_password}</p>}
                            {changePasswordError && changePasswordError.new_password &&
                                <p className="form__error form__message">{changePasswordError.new_password}</p>}
                            {passwordErrorSuccess &&
                                <p className="form__success form__message">{passwordErrorSuccess}</p>}
                        </div>
                    </div>
                    <p>{t("account_not_sure")}<NavLink className="account__form--reset"
                                                       to="/reset-password"> {t("reset_it")}</NavLink></p>
                    <p><span className="account__form--remove">{t("remove_account")}</span></p>
                    <button className="greenoutline--button" type="submit">
                        {t("update")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
