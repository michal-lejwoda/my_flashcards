import "../sass/login.css"
import {Form} from "react-bootstrap";
import {useTranslation} from "react-i18next";


const Login = () => {
    const {t} = useTranslation();
    return (
        <div className="login">
            <h1>{t('login')}</h1>
            <div className="login__container">
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>{t('username')}</Form.Label>
                        <Form.Control type="email" placeholder={t("enter_username")}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>{t('password')}</Form.Label>
                        <Form.Control type="password" placeholder="Password"/>
                    </Form.Group>
                    <div className="login__submit">
                        <button className="greenoutline--button" type="submit">
                            {t("submit")}
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;
