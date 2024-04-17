import {CloseButton, Modal} from "react-bootstrap";
import {EditModalProps} from "../interfaces.tsx";
import {useTranslation} from "react-i18next";

const EditModal: React.FC<EditModalProps> = ({editId, show, setShowEdit}) => {
    console.log("editId")
    console.log(editId)
    const {t} = useTranslation();
    return (
        <div>
            <Modal show={show} onHide={() => setShowEdit(false)}>
                <Modal.Header>
                    <Modal.Title>{t("edit")}</Modal.Title>
                    <CloseButton onClick={() => setShowEdit(false)} variant="white"/>
                </Modal.Header>
                <Modal.Body>
                    {/*<p>Jeśli jesteś pewien, że chcesz usunąć ten trening kliknij przycisk Usuń Trening</p>*/}
                </Modal.Body>
                <Modal.Footer>
                    <button className="standard-button"
                            // onClick={() => handleDelete()}
                    >
                        Edytuj
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EditModal;
