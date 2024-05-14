import {useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {LearnObject} from "../interfaces.tsx";
import {useTranslation} from "react-i18next";
import {getSingleDeckAllWords} from "../api.tsx";
import AuthContext from "../context/AuthContext.tsx";
import withAuth from "../context/withAuth.tsx";

const BrowseFlashcardsWords = () => {
    const [reverse, setReverse] = useState(true)
    const location = useLocation();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {token} = useContext(AuthContext);
    const [currentWord, setCurrentWord] = useState<LearnObject | null>(null)
    const [wordsToLearn, setWordsToLearn] = useState<LearnObject[]>([])
    const [wrongWordsToLearn, setWrongWordsToLearn] = useState<LearnObject[]>([])

    const handleGoNext = (result_type: boolean) => {
        if (currentWord) {
            if (!result_type) {
                setWrongWordsToLearn(prevState => [...prevState, currentWord]);
            }
        }
        getNextWord()
        setReverse(true)
    }

    function setInitData(wordsLearn: LearnObject[]) {
        if (wordsLearn.length > 0) {
            const first_word = wordsLearn.shift();
            if (first_word) {
                setCurrentWord(first_word)
                setWordsToLearn(wordsLearn);
            }
        }
    }

    const getData = async () => {
        const res = await getSingleDeckAllWords(location.state.id, token)
        setInitData(res.words)
    }

    useEffect(() => {
        if (!location.state) {
            navigate("/decks")
        } else {
            getData()
        }
    }, [])
    const getNextWord = () => {
        if (wordsToLearn.length > 0) {
            setCurrentWord(wordsToLearn[0])
            setWordsToLearn(prevState => prevState.slice(1));
            return null
        } else if (wrongWordsToLearn.length > 0) {
            setCurrentWord(wrongWordsToLearn[0])
            setWrongWordsToLearn(prevState => prevState.slice(1));
            return null
        }
    }

    return (
        <div className="learnflashcards">
            <h1 className="title">{t('learn')}</h1>
            <div className="learnflashcards__container">
                <p>{location.state.reverse ? currentWord?.back_side : currentWord?.front_side}</p>
                {!reverse &&
                    <div className="learnflashcards__translation">
                        <p className="translation__title">{t('translation')}</p>
                        <p>{location.state.reverse ? currentWord?.front_side : currentWord?.back_side}</p>
                    </div>
                }
            </div>
            <p><span>{wrongWordsToLearn.length}</span>/{wordsToLearn.length}</p>

            <div className="learnflashcards__buttons">
                {reverse &&
                    <div className="buttons__reverse">
                        <button className="standard-button" onClick={() => setReverse(false)}>{t("reverse")}</button>
                    </div>
                }
                {!reverse && currentWord &&
                    <div className="buttons__results">
                        <button className="standard-button"
                                onClick={() => handleGoNext(false)}>{t("again")}</button>
                        <button className="standard-button"
                                onClick={() => handleGoNext(true)}>{t("easy")}</button>
                    </div>
                }
            </div>

        </div>
    );
};

export default withAuth(BrowseFlashcardsWords);
