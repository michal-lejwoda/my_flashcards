import {useTranslation} from "react-i18next";
import {TextField} from "@mui/material";
import {useFormik} from "formik";
import {changeResetPasswordValidation} from "../validation.tsx";
import {handleSendMailWithResetPassword} from "../api.tsx";
import {useNavigate} from "react-router-dom";

const ResetPassword = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {values, handleChange, handleSubmit, errors} = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: changeResetPasswordValidation,
        validateOnChange: false,
        onSubmit: async () => {
            try {
                await handleSendMailWithResetPassword(values);
                alert(t("if_email_exists"));
                navigate("/login")
            } catch (error) {
                alert(t("reset_password_error"))
                navigate("/login")
            }
        },
    });

    return (
        <div className="reset_password">
            <h1 className="reset_password__title">{t("reset_password")}</h1>
            <div className="reset_password__body">
                <div className="change_email__form">
                    <p>{t("reset_password_notification")}</p>
                    <form onSubmit={handleSubmit}>
                        <div className="account__form--textfield change_email__form--textfield">
                            <TextField
                                name="email"
                                type="text"
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
                            </div>
                        </div>
                        <div className="account__button">
                            <button className="greenoutline--button" type="submit">
                                {t("update")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
