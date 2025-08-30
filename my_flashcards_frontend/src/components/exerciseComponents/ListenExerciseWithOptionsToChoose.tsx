import {
    ChooseExerciseDependsOnSingleTextAnswer,
    ListenExerciseWithOptionsToChooseProps,
    ResultData
} from "../../interfaces.tsx";
import {useContext, useEffect, useState} from "react";
import "../../sass/exercises/listen_exercise_with_options_to_choose.css";

import {handleSendChooseExerciseDependsOnSingleTextAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import {faVolumeUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useExerciseContext} from "../ExerciseContext.tsx";
import {useTranslation} from "react-i18next";


const ListenExerciseWithOptionsToChoose = ({playSound, exercise, id, slug, onScore}: ListenExerciseWithOptionsToChooseProps) => {
    const [selectedOptions, setSelectedOptions] = useState<ChooseExerciseDependsOnSingleTextAnswer[]>([]);
    const [disableButton, setDisableButton] = useState<boolean>(false)
    const {token} = useContext(AuthContext);
    const [results, setResults] = useState<ResultData | undefined>()
    const [resultMode, setResultMode] = useState<boolean>(false)
    const { shouldCheckAll, resetCheckAll } = useExerciseContext();
    const {t} = useTranslation();

    useEffect(() => {
        if (shouldCheckAll && !resultMode && !disableButton) {
            sendAnswers();
            resetCheckAll();
        }
    }, [shouldCheckAll, resultMode, disableButton]);


    const sendAnswers = async () => {
        if (disableButton || resultMode) return;
        const answers = {"answers": selectedOptions}
        const path_slug = `${id}/${slug}`
        const result = await handleSendChooseExerciseDependsOnSingleTextAnswers(path_slug, answers, token)
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

    const handleOptionClick = (questionId: string, option: string) => {
        setSelectedOptions((prev) => {
            const exists = prev.find(item => item.question_id === questionId);
            if (exists) {
                return prev.map(item =>
                    item.question_id === questionId ? {...item, answer: option} : item
                );
            }
            return [...prev, {question_id: questionId, answer: option}];
        });
    };

    const getOptionClassName = (questionId: string, option: string): string => {
        const selectedAnswer = selectedOptions.find(opt => opt.question_id === questionId)?.answer;
        const isSelected = selectedAnswer === option;

        let className = "cdost__option";

        if (!resultMode) {
            if (isSelected) {
                className += " cdost__option--selected";
            }
        } else if (results) {
            const resultAnswer = results.result_answers.find(
                (result) => result.person_label === questionId
            );

            if (resultAnswer) {
                if (option === resultAnswer.correct_answer) {
                    className += " cdost__option--correct";
                } else if (isSelected && !resultAnswer.correct) {
                    className += " cdost__option--incorrect";
                }
            }
        }

        return className;
    };


    return (
        <section className="lewotc">
            <div className="lewotc__allexercises">
                <div className="lewotc__description">
                     {t(exercise.description)}
                    </div>
                {exercise.exercises.map(element => {
                    return (
                        <div className="lewotc__singleexercise">
                            <div className="lewotc__questioncontainer" key={element.question_id}>
                                <div className="lewotc__question">{element.question}</div>
                                <div className="lewotc--soundbutton" onClick={() => playSound(exercise.audio)}>
                                    <FontAwesomeIcon
                                        size="lg" icon={faVolumeUp}/></div>
                            </div>
                            <div className="lewotc__options">
                                {element.options.map((answer, i) => {
                                    return (
                                        <div
                                            className={getOptionClassName(element.question_id, answer)}
                                            key={i}
                                            onClick={() => handleOptionClick(element.question_id, answer)}>
                                            {answer}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    )
                })}
            </div>
            <div className="lewotc__buttons">
                <button disabled={disableButton} className="greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>{resultMode ? t('Checked') : t('Check')}</button>
            </div>
        </section>
    );
};


export default ListenExerciseWithOptionsToChoose;
