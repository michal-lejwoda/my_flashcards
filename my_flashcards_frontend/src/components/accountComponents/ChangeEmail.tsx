import {useTranslation} from "react-i18next";
import {TextField, makeStyles, createStyles, Theme} from "@mui/material";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
        input: {
            color: "white !important"
        },
        label: {
            color: "white !important"
        }

    }),
);
const ChangeEmail = () => {
    const {t} = useTranslation();
    const classes = useStyles();
    return (
        <div className="change_email">
            <h1 className="account__title">{t("change_email")}</h1>
            <div className="change_email__form">
                <form className={classes.root} noValidate autoComplete="off">
                    <div className="account__form--textfield change_email__form--textfield">

                        <TextField
                            InputProps={{
                                className: classes.input
                            }}
                            // style={{borderColor: 'white'}}
                            // sx={{ input: { color: 'red !important' } }}
                            // InputProps={{ style: { color: "red !important" } }}
                            // id="outlined-basic"
                            label={t("change_email")}
                            variant="outlined"
                            // className="customTextField"
                            //        InputProps={{
                            //            style: {color: '#fff !important'},
                            //        }}
                            //        InputLabelProps={{
                            //            style: {color: '#fff'},
                            //        }}
                            // InputProps={{className: 'textFieldInput'}}
                        />
                    </div>
                    <div className="account__form--textfield change_email__form--textfield">
                        <TextField style={{borderColor: 'white'}}
                            // id="outlined-basic"
                                   label={t("current_password")}
                                   variant="filled"
                            // className="customTextField"
                                   InputLabelProps={{
                                       style: {color: '#fff !important'},
                                   }}
                                   inputProps={{
                                       style: {color: '#fff !important'},
                                   }}
                        />
                    </div>
                </form>
                <button className="greenoutline--button" type="submit">
                    {t("update")}
                </button>

            </div>
        </div>
    );
};

export default ChangeEmail;
