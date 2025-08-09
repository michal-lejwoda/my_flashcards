import {useContext, useState} from "react";
import {ChooseExerciseDependsOnSingleTextAnswer, ChooseExerciseDependsOnSingleTextProps} from "../../interfaces.tsx";
import {handleSendChooseExerciseDependsOnSingleTextAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import "../../sass/exercises/choose_exercise_depends_on_single_text.css"


const ChooseExerciseDependsOnSingleText = ({exercise, id, slug, onScore}: ChooseExerciseDependsOnSingleTextProps) => {
    const [selectedOptions, setSelectedOptions] = useState<ChooseExerciseDependsOnSingleTextAnswer[]>([]);
    console.log(selectedOptions)
    const [disableButton, setDisableButton] = useState<boolean>(false)

    const {token} = useContext(AuthContext);
    const sendAnswers = async () => {
        const answers = {"answers": selectedOptions}
        const path_slug = `${id}/${slug}`
        const result = await handleSendChooseExerciseDependsOnSingleTextAnswers(path_slug, answers, token)
        if (id !== undefined) {
            onScore(id.toString(), result.score, result.max_score)
        }
        setDisableButton(true)
        console.log("result", result)
        console.log("send answers", answers)
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

    console.log("selectedOptions", selectedOptions);

    return (
        <section className="cdost">
            <div className="cdost__content">
                <h1 className="cdost__title">ChooseExerciseDependsOnSingleText</h1>


                <div className="cdost__text">
                    {exercise.text}
                </div>
                <div className="cdost__description">{exercise.description}</div>

                <div className="cdost__choose-container">
                    {exercise.exercises.map((element) => {
                        const selectedAnswer = selectedOptions.find(opt => opt.question_id === element.question_id)?.answer;

                        return (
                            <div className="cdost__question-block" key={element.question_id}>
                                <div className="cdost__question">{element.question}</div>
                                <div className="cdost__options">
                                    {element.options.map((option, i) => {
                                        const isSelected = selectedAnswer === option;
                                        return (
                                            <div
                                                className={`cdost__option ${isSelected ? "cdost__option--selected" : ""}`}
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
                    <button disabled={disableButton} className="greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>Send</button>
                </div>
            </div>
        </section>
    );
};

export default ChooseExerciseDependsOnSingleText;
