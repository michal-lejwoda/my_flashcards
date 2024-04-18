import {CloseButton, Modal} from "react-bootstrap";
import {EditModalProps, SingleWordObject} from "../interfaces.tsx";
import {useTranslation} from "react-i18next";
import {getSingleWord} from "../api.tsx";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";

const EditModal: React.FC<EditModalProps> = ({editId, show, setShowEdit}) => {
    console.log("editId")
    console.log(editId)
    const {t} = useTranslation();
    const {token} = useContext(AuthContext);
    const [data, setData] = useState<SingleWordObject>({
        id: 0,
        created: '',
        modified: '',
        front_side: '',
        back_side: '',
        is_correct: false,
        next_learn: '',
        level: 0,
        user: 0,
    });
    console.log("data")
    console.log(data)
    const fetchEditData = async () => {
        if (editId) {
            const response = await getSingleWord(editId, token)
            console.log(response)
            setData(response)
            // console.log("response.data")
            // console.log(response.data)
        }
    }
    useEffect(() => {
        fetchEditData()
    }, [editId])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
    return (
        <div>
            <Modal show={show} onHide={() => setShowEdit(false)}>
                <Modal.Header>
                    <Modal.Title>{t("edit")}</Modal.Title>
                    <CloseButton onClick={() => setShowEdit(false)} variant="white"/>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        name="front_side"
                        value={data.front_side}
                        onChange={handleInputChange}
                        // onChange={(event) => setData(prevData => ({
                        //     ...prevData,
                        //     front_side: event.target.value,
                        // }))}
                    />
                    <input
                        type="text"
                        name="back_side"
                        value={data.back_side}
                        onChange={handleInputChange}
                        // onChange={(event) => setData(prevData => ({
                        //     ...prevData,
                        //     back_side: event.target.value,
                        // }))}
                    />

                    <input type="text"/>
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
