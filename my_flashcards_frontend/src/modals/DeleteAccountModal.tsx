import {CloseButton, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {DeleteAccountProps, deleteUserError, ErrorResponse} from "../interfaces.tsx";
import {TextField} from "@mui/material";
import {useFormik} from "formik";
import {changePasswordValidation} from "../validation.tsx";
import {handleDeleteUser} from "../api.tsx";
import {useContext, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

const DeleteAccountModal: React.FC<DeleteAccountProps> = ({showDeleteModal, setShowDeleteModal}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {token} = useContext(AuthContext);
    const auth = useContext(AuthContext);
    const [, ,removeCookie] = useCookies(['flashcard_user_auth']);
    const [deleteUserError, setDeleteUserError] = useState<deleteUserError | null>(null)
    const deleteAccount = async () => {
        try {
            const deleteUserResponse = await handleDeleteUser(values, token)
            if (deleteUserResponse && deleteUserResponse.message) {
                alert(t("account_deleted"))
                auth.setToken(null)
                removeCookie('flashcard_user_auth')
                navigate("/login")
            }
        } catch (err: unknown) {
            const error = err as ErrorResponse
            setDeleteUserError(error.response.data)
        }
    }
    const {values, handleChange, handleSubmit, errors} = useFormik({
        initialValues: {
            password: ""
        },
        validationSchema: changePasswordValidation,
        validateOnChange: false,
        onSubmit: () => {
            deleteAccount()
        },
    });
    return (
        <div className="delete_account">
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header>
                        <Modal.Title>{t("delete_account")}</Modal.Title>
                        <CloseButton onClick={() => setShowDeleteModal(false)} variant="white"/>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Jeśli chcesz usunąć konto wprowadź swoje aktualne hasło</p>
                        <TextField
                            name="password"
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
                            {errors.password && <p className="form__error form__message">{errors.password}</p>}
                            {deleteUserError && deleteUserError.password &&
                                <p className="form__error form__message">{deleteUserError.password}</p>}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="greenoutline--button" onClick={deleteAccount}>{t("delete")}</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
};

export default DeleteAccountModal;
