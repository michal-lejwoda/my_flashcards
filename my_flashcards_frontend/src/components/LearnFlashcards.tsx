import {useTranslation} from "react-i18next";
import {useContext, useEffect, useState} from "react";
import withAuth from "../context/withAuth.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {getSingleDeck, learnSingleWord} from "../api.tsx";
import AuthContext from "../context/AuthContext.tsx";
import {FlashcardsSet, LearnObject} from "../interfaces.tsx";
import {POSSIBLE_RESULTS} from "../globalFunctions.tsx";
import "../sass/learnflashcards.css"
import "../index.css"

const LearnFlashcards = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {token} = useContext(AuthContext);
    const [currentWord, setCurrentWord] = useState<LearnObject | null>(null)
    const [wordsToLearn, setWordsToLearn] = useState<LearnObject[]>([])
    const [wrongWordsToLearn, setWrongWordsToLearn] = useState<LearnObject[]>([])
    const {t} = useTranslation();
    const [reverse, setReverse] = useState(true)

    function setInitData(wordsLearn: LearnObject[], wrongWordsLearn: LearnObject[]) {
        if (wrongWordsLearn.length > 0) {

            const first_word = wrongWordsLearn.shift();
            if (first_word) {
                setCurrentWord(first_word)
                setWrongWordsToLearn(wrongWordsLearn)
                setWordsToLearn(wordsLearn);
            }
        }
        if (wordsLearn.length > 0) {
            const first_word = wordsLearn.shift();
            if (first_word) {
                setCurrentWord(first_word)
                setWrongWordsToLearn(wrongWordsLearn)
                setWordsToLearn(wordsLearn);
            }
        }
    }

    function getNextWord() {
        if (wrongWordsToLearn.length > 0) {
            const dateToCheck = new Date(wrongWordsToLearn[0].next_learn);
            const currentDate = new Date();
            if (currentDate > dateToCheck) {
                setCurrentWord(wrongWordsToLearn[0])
                setWrongWordsToLearn(prevState => prevState.slice(1));
                return null
            } else {
                if (wordsToLearn.length > 0) {
                    setCurrentWord(wordsToLearn[0])
                    setWordsToLearn(prevState => prevState.slice(1));
                    return null
                } else {
                    setCurrentWord(wrongWordsToLearn[0])
                    setWrongWordsToLearn(prevState => prevState.slice(1));
                    return null
                }
            }
        } else {
            if (wordsToLearn.length > 0) {
                setCurrentWord(wordsToLearn[0])
                setWordsToLearn(prevState => prevState.slice(1));
                return null
            }
        }
    }

    const getData = async () => {
        const res = await getSingleDeck(location.state.id, token)
        setInitData(res.words_to_learn, res.wrong_words_to_learn)
    }


    function getResultByKey(key: number): FlashcardsSet | undefined {
        // @ts-expect-error Its working Normally
        const result = POSSIBLE_RESULTS[0][key];
        if (result) {
            return result;
        }
        return undefined;
    }


    const handleGoNext = (level: number, res_type: string) => {
        const resultKey = getResultByKey(level)
        if (resultKey) {
            // @ts-expect-error Same here
            const res = resultKey[res_type]

            const form = {
                "result_type": res_type,
                "level": level
            }
            if (res.correct) {
                if (currentWord !== null) {
                    learnSingleWord(currentWord.id, token, form)
                }
            } else {
                if (currentWord !== null) {
                    learnSingleWord(currentWord.id, token, form)
                }
                setWrongWordsToLearn(prevState => {
                    const modifyCurrentWord = currentWord
                    if (modifyCurrentWord) {
                        const actualTime = new Date()
                        actualTime.setMinutes(actualTime.getMinutes() + res.time.minutes);
                        modifyCurrentWord.next_learn = actualTime.toISOString()
                        modifyCurrentWord.is_correct = false
                        const updatedState = [...prevState, modifyCurrentWord];
                        return updatedState.sort((a, b) => {
                            const nextLearnA = a.next_learn;
                            const nextLearnB = b.next_learn;
                            if (nextLearnA < nextLearnB) {
                                return -1;
                            }
                            if (nextLearnA > nextLearnB) {
                                return 1;
                            }
                            return 0;
                        });
                    }
                    return prevState;
                });
            }
        }
        getNextWord()
        setReverse(true)
    }

    useEffect(() => {
        if (!location.state) {
            navigate("/decks")
        } else {
            getData()
        }
    }, [])

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
                                onClick={() => handleGoNext(currentWord.level, "AGAIN")}>{t("again")}</button>
                        <button className="standard-button"
                                onClick={() => handleGoNext(currentWord.level, "HARD")}>{t("hard")}</button>
                        <button className="standard-button"
                                onClick={() => handleGoNext(currentWord.level, "MEDIUM")}>{t("medium")}</button>
                        <button className="standard-button"
                                onClick={() => handleGoNext(currentWord.level, "EASY")}>{t("easy")}</button>
                    </div>
                }
            </div>

        </div>

    );
};


export default withAuth(LearnFlashcards);
