import {useContext, useState} from "react";
import {
    ChooseExerciseDependsOnMultipleTextsProps,
    ChooseExerciseDependsOnSingleTextAnswer,
    ResultData
} from "../../interfaces.tsx";
import {handleSendChooseExerciseDependsOnSingleTextAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import "../../sass/exercises/choose_exercise_depends_on_multiple_texts.css"



const ChooseExerciseDependsOnMultipleTexts = ({
                                                  exercise,
                                                  id,
                                                  slug,
                                                  onScore
                                              }: ChooseExerciseDependsOnMultipleTextsProps) => {
    const [selectedOptions, setSelectedOptions] = useState<ChooseExerciseDependsOnSingleTextAnswer[]>([]);
    const {token} = useContext(AuthContext);
    const [disableButton, setDisableButton] = useState<boolean>(false)
    const [results, setResults] = useState<ResultData | undefined>()
    const [resultMode, setResultMode] = useState<boolean>(false)

    const sendAnswers = async () => {
        const answers = {"answers": selectedOptions}
        const path_slug = `${id}/${slug}`
        const result = await handleSendChooseExerciseDependsOnSingleTextAnswers(path_slug, answers, token)
        setResults(result)
        setResultMode(true)
        console.log("id", id)
        if (id !== undefined) {
            setDisableButton(true)
            onScore(id.toString(), result.score, result.max_score)
        }
    }

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

    console.log("selectedOptions", selectedOptions);

    return (
        <section className="cdomt">
            {/*<h1 className="cdomt__title">ChooseExerciseDependsOnMultipleText</h1>*/}
            <div className="cdomt__choose-container">
                {exercise.exercises.map((element) => {
                    return (
                        <div className="cdomt__questions" key={element.question_id}>
                            <div className="cdomt__text">
                                {element.text}
                            </div>
                            <div className="cdomt__question-block">
                                <div className="cdomt__question">{element.question}</div>
                                <div className="cdomt__options">
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
                        </div>
                    );
                })}
            </div>
            <div className="cdomt__buttons">
                <button disabled={disableButton} className="greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>Send</button>
            </div>
        </section>
    );
};

export default ChooseExerciseDependsOnMultipleTexts;
