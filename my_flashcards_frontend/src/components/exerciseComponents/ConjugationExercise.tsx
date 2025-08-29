import {ConjugationExerciseAnswer, ConjugationExerciseProps, ResultData} from "../../interfaces.tsx";
import {useContext, useEffect, useState} from "react";
import {handleSendConjugationExerciseAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import "../../sass/exercises/conjugation_exercise.css"
import {useExerciseContext} from "../ExerciseContext.tsx";

const ConjugationExercise = ({playSound, exercise, id, slug, onScore}: ConjugationExerciseProps) => {
    const [formData, setFormData] = useState<ConjugationExerciseAnswer[]>(() =>
        exercise.conjugation_rows.reduce((acc, row) => {
            if (!row.is_pre_filled && row.person_label) {
                acc.push({person_label: row.person_label, answer: ''});
            }
            return acc;
        }, [] as ConjugationExerciseAnswer[])
    );
    const [disableButton, setDisableButton] = useState<boolean>(false)
    const [results, setResults] = useState<ResultData | undefined>()
    const [resultMode, setResultMode] = useState<boolean>(false)
    const { shouldCheckAll, resetCheckAll } = useExerciseContext();
    const {token} = useContext(AuthContext);

    useEffect(() => {
        if (shouldCheckAll && !resultMode && !disableButton) {
            sendAnswers();
            resetCheckAll();
        }
    }, [shouldCheckAll, resultMode, disableButton]);

    const sendAnswers = async () => {
        if (disableButton || resultMode) return;
        const answers = {"answers": formData}
        const path_slug = `${id}/${slug}`
        const result = await handleSendConjugationExerciseAnswers(path_slug, answers, token)
        if (id !== undefined) {
            onScore(id.toString(), result.score, result.max_score)
        }
        setResults(result)
        setResultMode(true)
        setDisableButton(true)
        if (result.score == result.max_score){
            playSound('/RightAnswer.mp3')
        }else{
            playSound('/WrongAnswer.mp3')
        }
    }

    const getOptionClassName = (person_label: string): string => {
        let className = "conjugation-exercise__input "
        if (resultMode){
            if (results){
                const row  = results.result_answers.find(element=> element.person_label == person_label)
                if (!row?.correct){
                    className += "conjugation-exercise__input--wrong"
                }
                else{
                    className += "conjugation-exercise__input--correct"
                }
            }
        }
        return className
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (resultMode) return;
        const {name, value} = e.target;

        setFormData(prev =>
            prev.map(row =>
                row.person_label === name ? {...row, answer: value} : row
            )
        );
    };

    const getResultData = (personLabel: string) => {
        if (resultMode && results?.result_answers) {
            return results.result_answers.find(row => row.person_label === personLabel);
        }
        return null;
    };

    return (
        <section className="conjugation-exercise">
            <div className="conjugation-exercise__container">
                <div className="conjugation-exercise__rowscontainer">
                    <div className="conjugation-exercise__name">{exercise.instruction}</div>
                    <div className="conjugation-exercise__rowcenter">

                        {exercise.conjugation_rows.map(element => {
                            const resultData = getResultData(element.person_label);
                            const isIncorrect = resultData?.correct === false;

                            return (
                                <div className="conjugation-exercise__row" key={element.person_label}>
                                    <div className="conjugation-exercise__person-label">{element.person_label}</div>

                                    {element.is_pre_filled ?
                                        <input
                                            className="conjugation-exercise__input"
                                            type="text"
                                            value={element.correct_form}
                                            disabled
                                        /> :
                                        <div className="conjugation-exercise__input-wrapper">
                                            <input
                                                className={getOptionClassName(element.person_label)}
                                                name={element.person_label}
                                                onChange={handleChange}
                                                type="text"
                                            />

                                            {resultMode && resultData && (
                                                <div className="conjugation-exercise__feedback">
                                                    {/*{isCorrect && (*/}
                                                    {/*    <span className="conjugation-exercise__feedback--correct">*/}
                                                    {/*        ✓ Correct*/}
                                                    {/*    </span>*/}
                                                    {/*)}*/}
                                                    {isIncorrect && (
                                                        <span className="conjugation-exercise__feedback--incorrect">
                                                            ✗ Correct_answer: <strong>{resultData.correct_answer}</strong>
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="conjugationexercise__buttons ">
                    <button disabled={disableButton}  className="greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>Send</button>
                </div>
            </div>
        </section>
    );
};

export default ConjugationExercise;
