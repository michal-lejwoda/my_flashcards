import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import {useContext, useState} from "react";
import AuthContext from "../../context/AuthContext.tsx";
import {ChangePasswordError, ChangePasswordProps, ErrorResponse} from "../../interfaces.tsx";
import {useFormik} from "formik";
import {changePasswordValidation} from "../../validation.tsx";
import {changePassword} from "../../api.tsx";
import CenteredForm from "../elements/CenteredForm.tsx";
import InputField from "../elements/InputField.tsx";
import ErrorMessage from "../elements/errors/ErrorMessage.tsx";
import BackendErrorMessage from "../elements/errors/BackendErrorMessage.tsx";
import SuccessMessage from "../elements/errors/SuccessMessage.tsx";
import GreenButton from "../elements/GreenButton.tsx";

const ChangePassword: React.FC<ChangePasswordProps> = ({setShowDeleteModal}) => {
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
            <h2 className="account__title centered__title">{t("change_password")}</h2>
            <CenteredForm handleSubmit={handleSubmit}>
                <div className="account__form--textfield change_password__form--textfield">
                    <InputField
                        label={t("current_password")}
                        name="old_password"
                        type="password"
                        handleChange={handleChange}
                    />
                    <div className="errors form__errors">
                        {errors.old_password && <ErrorMessage message={errors.old_password}/>}
                        {changePasswordError && changePasswordError.old_password &&
                            <BackendErrorMessage message={changePasswordError.old_password}/>}
                    </div>
                </div>
                <div className="account__form--textfield change_password__form--textfield">
                    <InputField
                        label={t("new_password")}
                        name="new_password"
                        type="password"
                        handleChange={handleChange}
                    />
                    <div className="errors form__errors">
                        <div className="errors form__errors">
                            {errors.new_password && <ErrorMessage message={errors.new_password}/>}
                            {changePasswordError && changePasswordError.new_password &&
                                <BackendErrorMessage message={changePasswordError.new_password}/>}
                            {passwordErrorSuccess &&
                                <SuccessMessage message={passwordErrorSuccess}/>}
                        </div>
                    </div>
                </div>
                <p>{t("account_not_sure")}<NavLink className="account__form--reset"
                                                   to="/reset-password"> {t("reset_it")}</NavLink></p>
                <p>
                    <span className="account__form--remove"
                          onClick={() => setShowDeleteModal(true)}>{t("remove_account")}</span></p>
                <div className="account__button">
                    <GreenButton message={t("update")}/>
                </div>

            </CenteredForm>
        </div>
    );
};

export default ChangePassword;
