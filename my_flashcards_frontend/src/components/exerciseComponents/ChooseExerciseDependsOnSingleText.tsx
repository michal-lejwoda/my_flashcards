import {useContext, useEffect, useState} from "react";
import {
    ChooseExerciseDependsOnSingleTextAnswer,
    ChooseExerciseDependsOnSingleTextProps,
    ResultData
} from "../../interfaces.tsx";
import {handleSendChooseExerciseDependsOnSingleTextAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import "../../sass/exercises/choose_exercise_depends_on_single_text.css"
import {useExerciseContext} from "../ExerciseContext.tsx";
import {useTranslation} from "react-i18next";


const ChooseExerciseDependsOnSingleText = ({playSound, exercise, id, slug, onScore}: ChooseExerciseDependsOnSingleTextProps) => {
    const [selectedOptions, setSelectedOptions] = useState<ChooseExerciseDependsOnSingleTextAnswer[]>([]);
    const [disableButton, setDisableButton] = useState<boolean>(false)
    const [results, setResults] = useState<ResultData | undefined>()
    const [resultMode, setResultMode] = useState<boolean>(false)
    const { shouldCheckAll, resetCheckAll } = useExerciseContext();
    const {t} = useTranslation();

    const {token} = useContext(AuthContext);
    const sendAnswers = async () => {
        if (disableButton || resultMode) return;
        const answers = {"answers": selectedOptions}
        const path_slug = `${id}/${slug}`
        const result = await handleSendChooseExerciseDependsOnSingleTextAnswers(path_slug, answers, token)
        setResults(result)
        setResultMode(true)
        if (id !== undefined) {
            setDisableButton(true)
            onScore(id.toString(), result.score, result.max_score)
        }
        if (result.score == result.max_score){
            playSound('/RightAnswer.mp3')
        }else{
            playSound('/WrongAnswer.mp3')
        }
    }

    useEffect(() => {
        if (shouldCheckAll && !resultMode && !disableButton) {
            sendAnswers();
            resetCheckAll();
        }
    }, [shouldCheckAll, resultMode, disableButton]);

   const handleOptionClick = (questionId: string, option: string) => {
        if (resultMode) return;

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

        let className = "cdomt__option";

        if (!resultMode) {
            if (isSelected) {
                className += " cdomt__option--selected";
            }
        } else if (results) {
            const resultAnswer = results.result_answers.find(
                (result) => result.person_label === questionId
            );

            if (resultAnswer) {
                if (option === resultAnswer.correct_answer) {
                    className += " cdomt__option--correct";
                } else if (isSelected && !resultAnswer.correct) {
                    className += " cdomt__option--incorrect";
                }
            }
        }

        return className;
    };

    return (
        <section className="cdost">
            <div className="cdost__content">
                <div className="fitewc__description">{t(exercise.description)}</div>
                <div className="cdost__text">
                    {exercise.text}
                </div>

                <div className="cdost__choose-container">
                    {exercise.exercises.map((element) => {
                        return (
                            <div className="cdost__question-block" key={element.question_id}>
                                <div className="cdost__question">{element.question}</div>
                                <div className="cdost__options">
                                    {element.options.map((option, i) => {
                                        return (
                                            <div
                                                className={getOptionClassName(element.question_id, option)}
                                                key={i}
                                                onClick={() => handleOptionClick(element.question_id, option)}
                                            >
                                                {option}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="cdost__buttons">
                    <button disabled={disableButton} className="greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>{resultMode ? t('Checked') : t('Check')}</button>
                </div>
            </div>
        </section>
    );
};

export default ChooseExerciseDependsOnSingleText;
