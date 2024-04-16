import {CloseButton, Modal} from "react-bootstrap";

const EditModal = (show: boolean, handleClose: unknown) => {
    return (
        <div>
            <Modal show={show} onHide={() => handleClose(false)}>
                <Modal.Header>
                    <Modal.Title>Stworzono Trening</Modal.Title>
                    <CloseButton onClick={() => handleClose(false)} variant="white"/>
                </Modal.Header>
                <Modal.Body>
                    <p>Jeśli jesteś pewien, że chcesz usunąć ten trening kliknij przycisk Usuń Trening</p>
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
