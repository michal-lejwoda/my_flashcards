import {CloseButton, Modal} from "react-bootstrap";
import {EditWordModalProps, SingleWordObject} from "../interfaces.tsx";
import {useTranslation} from "react-i18next";
import {editSingleWord, getSingleWord} from "../api.tsx";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";

const EditWordModal: React.FC<EditWordModalProps> = ({editId, show, setShowEdit, refreshDeck}) => {
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
    const fetchEditData = async () => {
        if (editId) {
            const response = await getSingleWord(editId, token)
            console.log(response)
            setData(response)
        }
    }
    useEffect(() => {
        fetchEditData()
    }, [editId])

    const handleChangePlaces = async () => {
        console.log("handleChangePlaces")
        try {
            const {id, front_side, back_side} = data;
            const json_obj = {"front_side": back_side, "back_side": front_side}
            await editSingleWord(id, token, json_obj)
            await refreshDeck()
            await setShowEdit(false)
        } catch (e) {
            // TODO BAck HEre
            console.log(e)
        }


    }
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const saveEditData = async () => {
        try {
            const {id, front_side, back_side} = data;
            const json_obj = {"front_side": front_side, "back_side": back_side}
            await editSingleWord(id, token, json_obj)
            await refreshDeck()
            await setShowEdit(false)
        } catch (e) {
            // TODO BAck HEre
            console.log(e)
        }
    }

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
                    />
                    <input
                        type="text"
                        name="back_side"
                        value={data.back_side}
                        onChange={handleInputChange}
                    />

                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleChangePlaces}>{t("change_places")}</button>
                    <button onClick={saveEditData}>{t("save")}</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EditWordModal;
