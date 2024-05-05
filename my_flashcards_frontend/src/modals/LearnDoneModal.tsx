import {CloseButton, Modal} from "react-bootstrap";
import GreenButton from "../components/elements/GreenButton.tsx";
import {useTranslation} from "react-i18next";
import {LearnDoneModalInterface} from "../interfaces.tsx";
import React from "react";


const LearnDoneModal: React.FC<LearnDoneModalInterface> = ({showLearnDone, setShowLearnDone}) => {
    const {t} = useTranslation();
    return (
        <>
            <Modal show={showLearnDone} onHide={() => setShowLearnDone(false)}>
                <Modal.Header>
                    <Modal.Title>{t("learn_done")}</Modal.Title>
                    <CloseButton onClick={() => setShowLearnDone(false)} variant="white"/>
                </Modal.Header>
                <Modal.Body>
                    <p>Aktualnie nie masz żadnych słówek do nauki. Jeśli chcesz możesz spróbować wybrać opcje
                        przeglądania w menu akcji. Dzięki czemu będziesz mógł przeglądać słówka bez ingerencji w
                        plan</p>
                </Modal.Body>
                <Modal.Footer>
                    <GreenButton onClick={() => setShowLearnDone(false)} message={t("close")}/>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default LearnDoneModal;
