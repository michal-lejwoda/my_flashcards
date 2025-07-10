import {useContext, useState} from "react";
import {ChooseExerciseDependsOnMultipleTextsProps, ChooseExerciseDependsOnSingleTextAnswer} from "../../interfaces.tsx";
import {handleSendChooseExerciseDependsOnSingleTextAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";


const ChooseExerciseDependsOnMultipleTexts = ({exercise, id, slug}: ChooseExerciseDependsOnMultipleTextsProps) => {
    const [selectedOptions, setSelectedOptions] = useState<ChooseExerciseDependsOnSingleTextAnswer[]>([]);
    const {token} = useContext(AuthContext);
    const sendAnswers = () => {
        const answers = {"answers": selectedOptions}
        const path_slug = `${id}/${slug}`
        handleSendChooseExerciseDependsOnSingleTextAnswers(path_slug, answers, token)
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
        <section className="cdomt">
            <h1 className="cdomt__title">ChooseExerciseDependsOnMultipleText</h1>
            <div className="cdomt__choose-container">
                {exercise.exercises.map((element) => {
                    const selectedAnswer = selectedOptions.find(opt => opt.question_id === element.question_id)?.answer;

                    return (
                        <div className="cdomt__question-block" key={element.question_id}>
                            <div className="cdomt__text">
                                {element.text}
                            </div>
                            <div className="cdomt__question">{element.question}</div>
                            <div className="cdomt__options">
                                {element.options.map((option, i) => {
                                    const isSelected = selectedAnswer === option;
                                    return (
                                        <div
                                            className={`cdomt__option ${isSelected ? "cdomt__option--selected" : ""}`}
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
            <div className="cdomt__buttons">
                <button onClick={sendAnswers}>Send</button>
            </div>
        </section>
    );
};

export default ChooseExerciseDependsOnMultipleTexts;
