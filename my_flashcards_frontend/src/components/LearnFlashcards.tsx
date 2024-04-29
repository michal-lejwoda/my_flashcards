import {useTranslation} from "react-i18next";
import "../sass/learnflashcards.css"
import "../index.css"
import {useState} from "react";
import withAuth from "../context/withAuth.tsx";

const LearnFlashcards = () => {
    const {t} = useTranslation();
    const [reverse, setReverse] = useState(true)
    const handleGoNext = () => {
        setReverse(true)
    }
    // TODO Back here
    return (
        <div className="learnflashcards">
            <h1 className="title">{t('learn')}</h1>
            <div className="learnflashcards__container">
                <p>Słowohsdfbjdsfbhdfsjbfdshjhjsbdf</p>
                <div className="learnflashcards__translation">
                    <p className="translation__title">{t('translation')}</p>
                    <p>Słowohsdfbjdsfbhdfsjbfdshjhjsbdf</p>
                </div>
            </div>
            <div className="learnflashcards__buttons">
                {reverse &&
                    <div className="buttons__reverse">
                        <button className="standard-button" onClick={()=> setReverse(false)}>{t("reverse")}</button>
                    </div>
                }
                {!reverse &&
                    <div className="buttons__results">
                        <button className="standard-button" onClick={handleGoNext}>{t("again")}</button>
                        <button className="standard-button" onClick={handleGoNext}>{t("easy")}</button>
                        <button className="standard-button" onClick={handleGoNext}>{t("medium")}</button>
                        <button className="standard-button" onClick={handleGoNext}>{t("hard")}</button>
                    </div>
                }
            </div>

        </div>

    );
};


export default withAuth(LearnFlashcards);
