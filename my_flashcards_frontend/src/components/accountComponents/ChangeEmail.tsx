import {useTranslation} from "react-i18next";
import {TextField} from "@mui/material";

const ChangeEmail = () => {
    const {t} = useTranslation();

    return (
        <div className="change_email">
            <h1 className="account__title">{t("change_email")}</h1>
            <div className="change_email__form">

                <div className="account__form--textfield change_email__form--textfield">

                    <TextField
                        label={t("change_email")}
                        variant="outlined"
                        className="customTextField"
                        InputLabelProps={{
                            style: {color: '#fff'},
                        }}
                    />
                </div>
                <div className="account__form--textfield change_email__form--textfield">
                    <TextField style={{borderColor: 'white'}} id="outlined-basic" label={t("current_password")}
                               variant="outlined"
                               className="customTextField"
                               InputLabelProps={{
                                   style: {color: '#fff'},
                               }}/>
                </div>
                <button className="greenoutline--button" type="submit">
                    {t("update")}
                </button>

            </div>
        </div>
    );
};

export default ChangeEmail;
