import {useTranslation} from "react-i18next";
import {TextField} from "@mui/material";
import {NavLink} from "react-router-dom";

const ChangePassword = () => {
    const {t} = useTranslation();
    return (
        <div className="change_password">
            <h1 className="account__title">{t("change_password")}</h1>
            <div className="change_password__form">
                <div className="account__form--textfield change_password__form--textfield">
                    <TextField style={{borderColor: 'white'}} id="outlined-basic" label={t("new_password")}
                               variant="outlined"
                               className="customTextField"
                               InputLabelProps={{
                                   style: {color: '#fff'},
                               }}/>
                </div>
                <div className="account__form--textfield change_password__form--textfield">
                    <TextField style={{borderColor: 'white'}} id="outlined-basic" label={t("current_password")}
                               variant="outlined"
                               className="customTextField"
                               InputLabelProps={{
                                   style: {color: '#fff'},
                               }}/>
                </div>
                <p>{t("account_not_sure")}<NavLink to="/reset-password"> {t("reset it")}</NavLink></p>
                <p><span className="account__form--remove">{t("remove_account")}</span></p>
                <button className="greenoutline--button" type="submit">
                    {t("update")}
                </button>

            </div>
        </div>
    );
};

export default ChangePassword;
