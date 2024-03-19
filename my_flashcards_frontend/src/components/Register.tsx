import {useTranslation} from "react-i18next";
import {Form} from "react-bootstrap";
import "../sass/register.css";

const Register = () => {
    const {t} = useTranslation();
    return (
        <div className="register">
            <h1>{t('register')}</h1>
            <div className="register__container">
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>{t('username')}</Form.Label>
                        <Form.Control type="text" placeholder={t("enter_username")}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>{t('email')}</Form.Label>
                        <Form.Control type="email" placeholder={t("enter_email")}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>{t('password')}</Form.Label>
                        <Form.Control type="password" placeholder={t("password")}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>{t('repeat_password')}</Form.Label>
                        <Form.Control type="password" placeholder={t("repeat_password")}/>
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

export default Register;
