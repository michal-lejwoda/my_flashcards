import {CloseButton, Modal} from "react-bootstrap";
import {EditWordModalProps, SingleWordObject} from "../interfaces.tsx";
import {useTranslation} from "react-i18next";
import {editSingleWord, getSingleWord} from "../api.tsx";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";
import InputFieldWithoutFormik from "../components/elements/InputFieldWithoutFormik.tsx";
import GreenButton from "../components/elements/GreenButton.tsx";

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
            setData(response)
        }
    }
    useEffect(() => {
        fetchEditData()
    }, [editId])

    const handleChangePlaces = async () => {
        try {
            const {id, front_side, back_side} = data;
            const json_obj = {"front_side": back_side, "back_side": front_side}
            await editSingleWord(id, token, json_obj)
            await fetchEditData()
            await refreshDeck()
            await setShowEdit(false)
        } catch {
            // Blank
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
        } catch {
            // Blank
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
                    <div className="account__form--textfield">
                        <InputFieldWithoutFormik handleChange={handleInputChange}
                                                 label={t("front_page")}
                                                 type="text"
                                                 name="front_side"
                                                 value={data.front_side}
                        />
                    </div>
                    <div className="account__form--textfield">
                        <InputFieldWithoutFormik handleChange={handleInputChange}
                                                 label={t("reverse_page")}
                                                 type="text"
                                                 name="back_side"
                                                 value={data.back_side}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <GreenButton onClick={handleChangePlaces} message={t("change_places")} />
                    <GreenButton onClick={saveEditData} message={t("save")} />
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EditWordModal;
