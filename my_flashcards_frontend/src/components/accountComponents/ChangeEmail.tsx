import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import {changeEmailValidation} from "../../validation.tsx";
import {changeEmail} from "../../api.tsx";
import {ChangeEmailError, ErrorResponse} from "../../interfaces.tsx";
import {useContext, useState} from "react";
import AuthContext from "../../context/AuthContext.tsx";
import GreenButton from "../elements/GreenButton.tsx";
import SuccessMessage from "../elements/errors/SuccessMessage.tsx";
import ErrorMessage from "../elements/errors/ErrorMessage.tsx";
import BackendErrorMessage from "../elements/errors/BackendErrorMessage.tsx";
import InputField from "../elements/InputField.tsx";

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
            <h2 className="account__title">{t("change_email")}</h2>
            <div className="change_email__form">
                <form onSubmit={handleSubmit}>
                    <div className="account__form--textfield change_email__form--textfield">
                        <InputField
                            label={t("current_password")}
                            name="email"
                            type="email"
                            handleChange={handleChange}
                        />
                        <div className="errors form__errors">
                            {errors.email && <ErrorMessage message={errors.email}/>}
                            {changeEmailError && changeEmailError.email &&
                                <BackendErrorMessage message={changeEmailError.email}/>}
                        </div>
                    </div>

                    <div className="account__form--textfield change_email__form--textfield">
                        <InputField
                            label={t("current_password")}
                            name="password"
                            type="password"
                            handleChange={handleChange}
                        />
                        <div className="errors form__errors">
                            {errors.password && <ErrorMessage message={errors.password}/>}
                            {changeEmailError && changeEmailError.password &&
                                <BackendErrorMessage message={changeEmailError.password}/>}
                            {emailErrorSuccess && <SuccessMessage message={emailErrorSuccess}/>}
                        </div>
                    </div>
                    <div className="account__button">
                        <GreenButton message={t("update")}/>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangeEmail;
