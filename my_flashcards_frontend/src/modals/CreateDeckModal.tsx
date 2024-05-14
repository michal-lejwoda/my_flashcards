import {CloseButton, Modal} from "react-bootstrap";
import {CreateDeckError, CreateDeckModalProps, ErrorResponse} from "../interfaces.tsx";
import {useTranslation} from "react-i18next";
import {createDeck} from "../api.tsx";
import {useContext, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";
import GreenButton from "../components/elements/GreenButton.tsx";
import {useFormik} from "formik";
import {createDeckValidation} from "../validation.tsx";
import InputField from "../components/elements/InputField.tsx";
import CenteredForm from "../components/elements/CenteredForm.tsx";
import ErrorMessage from "../components/elements/errors/ErrorMessage.tsx";
import BackendErrorMessage from "../components/elements/errors/BackendErrorMessage.tsx";

const CreateDeckModal: React.FC<CreateDeckModalProps> = ({openCreateDeckModal, setOpenCreateDeckModal}) => {
    const {t} = useTranslation();
    const {token} = useContext(AuthContext);
    const [error, setError] = useState<CreateDeckError | null>(null)
    const {values, handleSubmit, handleChange, errors} = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: createDeckValidation,
        validateOnChange: false,
        onSubmit: () => {
            handleCreateDeck()
        },
    });

    const handleCreateDeck = async () => {
        try {
            await createDeck(values, token)
            setOpenCreateDeckModal(false)
            location.reload()

        } catch (err: unknown) {
            const error = err as ErrorResponse
            setError(error.response.data)
        }
    }

    return (
        <div>
            <Modal show={openCreateDeckModal} onHide={() => setOpenCreateDeckModal(false)}>
                <CenteredForm handleSubmit={handleSubmit}>
                    <Modal.Header>
                        <Modal.Title>{t("create_deck")}</Modal.Title>
                        <CloseButton onClick={() => setOpenCreateDeckModal(false)} variant="white"/>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="account__form--textfield">
                            <InputField
                                handleChange={handleChange}
                                label={t("name")}
                                type="text"
                                name="name"
                                value={values.name}
                            />
                            <div className="errors form__errors">
                                {errors.name && <ErrorMessage message={errors.name}/>}
                                {error && error.name && (
                                    <BackendErrorMessage message={error.name}/>
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <GreenButton message={t("save")}/>
                    </Modal.Footer>
                </CenteredForm>
            </Modal>
        </div>
    );
};

export default CreateDeckModal;
