import {useTranslation} from "react-i18next";
import "../sass/learnflashcards.css"
import "../index.css"
import {useContext, useEffect, useState} from "react";
import withAuth from "../context/withAuth.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {getSingleDeck} from "../api.tsx";
import AuthContext from "../context/AuthContext.tsx";

const LearnFlashcards = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {token} = useContext(AuthContext);
    const [data, setData] = useState([])
    const {t} = useTranslation();
    const [reverse, setReverse] = useState(true)

    const getData = async () => {
        const res = await getSingleDeck(location.state.id, token)
        setData(res)
    }

    const handleGoNext = () => {
        setReverse(true)
    }

    useEffect(() => {
        if (!location.state) {
            navigate("/decks")
        } else {
            getData()
        }
    }, [])
    console.log("data")
    console.log(data)
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
                        <button className="standard-button" onClick={() => setReverse(false)}>{t("reverse")}</button>
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
