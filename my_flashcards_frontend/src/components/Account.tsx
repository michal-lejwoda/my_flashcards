import withAuth from "../context/withAuth.tsx";
import {useTranslation} from "react-i18next";
import ChangeEmail from "./accountComponents/ChangeEmail.tsx";
import ChangePassword from "./accountComponents/ChangePassword.tsx";
import {useState} from "react";
import "../sass/account.css"
import DeleteAccountModal from "../modals/DeleteAccountModal.tsx";

const Account = () => {
    const {t} = useTranslation();
    const [clickedButton, setClickedButton] = useState<string>('CHANGE_EMAIL');
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const handleClick = (value: string) => {
        setClickedButton(value);
    };
    return (
        <section className="account__section ">
            <div className="account">
                <div className="account__header">
                    <h1 className="account__header--title">{t("account_settings")}</h1>
                </div>
                <div className="account__body">
                    <div className="account__options">
                        <div className="account__options--input">
                            <button className="account__options--button" style={{backgroundColor: clickedButton === 'CHANGE_EMAIL' ? '#8ae001' : '#1c1c1a'}}
                                    onClick={() => handleClick('CHANGE_EMAIL')}>{t("change_email")}
                            </button>
                        </div>
                        <div className="account__options--input">
                            <button className="account__options--button"
                                style={{backgroundColor: clickedButton === 'CHANGE_PASSWORD' ? '#8ae001' : '#1c1c1a'}}
                                onClick={() => handleClick('CHANGE_PASSWORD')}>{t("change_password")}</button>
                        </div>
                    </div>
                    <div className="account__form">
                        {clickedButton === 'CHANGE_EMAIL' &&
                            <ChangeEmail/>
                        }
                        {clickedButton === 'CHANGE_PASSWORD' &&
                            <ChangePassword setShowDeleteModal={setShowDeleteModal} />
                        }
                        <DeleteAccountModal showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal}/>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default withAuth(Account);
