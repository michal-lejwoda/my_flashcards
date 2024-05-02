import {useTranslation} from "react-i18next";
import "../sass/learnflashcards.css"
import "../index.css"
import {useContext, useEffect, useState} from "react";
import withAuth from "../context/withAuth.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {getSingleDeck} from "../api.tsx";
import AuthContext from "../context/AuthContext.tsx";
import {LearnObject} from "../interfaces.tsx";
import {POSSIBLE_RESULTS} from "../globalFunctions.tsx";

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
            setCurrentWord(first_word)
            setWrongWordsToLearn(wrongWordsLearn)
            setWordsToLearn(wordsLearn);
        }
        if (wordsLearn.length > 0) {
            const first_word = wordsLearn.shift();
            setCurrentWord(first_word)
            setWrongWordsToLearn(wrongWordsLearn)
            setWordsToLearn(wordsLearn);
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
                    setCurrentWord(wrongWordsToLearn[0])
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
                setCurrentWord(wrongWordsToLearn[0])
                setWordsToLearn(prevState => prevState.slice(1));
                return null
            }
        }
    }

    // function selectCurrentWord(): LearnObject | null {
    //     if (wrongWordsToLearn.length > 0) {
    //         const currentWord = wrongWordsToLearn[0];
    //         setWrongWordsToLearn(prevState => prevState.slice(1));
    //         return currentWord;
    //     }
    //     if (wordsToLearn.length > 0) {
    //         const currentWord = wordsToLearn[0];
    //         setWordsToLearn(prevState => prevState.slice(1)); // Usuń pierwszy element z wordsToLearn
    //         return currentWord;
    //     }
    //     return null;
    // }

    const getData = async () => {
        const res = await getSingleDeck(location.state.id, token)
        setInitData(res.words_to_learn, res.wrong_words_to_learn)
    }

    function getResultByKey(key: string): { [key: string]: any } | undefined {
        const result = POSSIBLE_RESULTS.find(result => result.hasOwnProperty(key));
        if (result) {
            return result[key];
        }
        return undefined;
    }

    const handleGoNext = (level: number, res_type: string) => {
        const res = getResultByKey(level.toString())[res_type]
        console.log("res")
        console.log(res)
        if (res.correct) {
            // TODO: Add endpoint with time and go next
        } else {
            setWrongWordsToLearn(prevState => {
                console.log("current_word")
                console.log(currentWord)
                console.log("Date()")
                console.log(Date())
                const modifyCurrentWord = currentWord
                const nextLearnDate = new Date(modifyCurrentWord.next_learn);
                console.log("nextLearnDate.toISOString()")
                console.log("res.times.minutes")
                console.log(res.time.minutes)
                nextLearnDate.setMinutes(nextLearnDate.getMinutes() + res.time.minutes);
                console.log(currentWord.next_learn)
                console.log(nextLearnDate.toISOString())
                modifyCurrentWord.next_learn = nextLearnDate
                modifyCurrentWord.is_correct = false
                console.log("nextLearnDate")
                console.log(nextLearnDate)
                console.log("modifyCurrentWord")
                console.log(modifyCurrentWord)
                const updatedState = [...prevState, currentWord];
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
            });
            // setWrongWordsToLearn(prevState => [...prevState, currentWord]);// Dodaj bieżące słowo do tablicy
            // const sortedWrongWordsToLearn = [...wrongWordsToLearn].sort((a, b) => {
            //     const nextLearnA = a.next_learn;
            //     const nextLearnB = b.next_learn;
            //     if (nextLearnA < nextLearnB) {
            //         return -1;
            //     }
            //     if (nextLearnA > nextLearnB) {
            //         return 1;
            //     }
            //     return 0;
            // });
            // setWrongWordsToLearn(sortedWrongWordsToLearn); // Ustaw posortowaną tablicę
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

    console.log("currentWord")
    console.log(currentWord)
    console.log("wrongWordsToLearn")
    console.log(wrongWordsToLearn)
    console.log("wordsToLearn")
    console.log(wordsToLearn)
    // const addRecordToWrongWordsToLearn = () => {
    //     console.log("addRecordToWrongWordsToLearn")
    // }
    //
    // function sortDataByNextLearnDescending(): void {
    //     wrongWordsToLearn.sort((a, b) => {
    //         const dateA = new Date(a.next_learn);
    //         const dateB = new Date(b.next_learn);
    //         return dateB.getTime() - dateA.getTime();
    //     });
    // }


    // TODO Back here
    return (
        <div className="learnflashcards">
            <h1 className="title">{t('learn')}</h1>
            <div className="learnflashcards__container">
                <p>{currentWord?.front_side}</p>
                <div className="learnflashcards__translation">
                    <p className="translation__title">{t('translation')}</p>
                    <p>{currentWord?.back_side}</p>
                </div>
            </div>
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
