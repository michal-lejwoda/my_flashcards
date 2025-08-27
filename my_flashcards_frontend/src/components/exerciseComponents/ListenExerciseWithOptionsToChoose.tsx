import {
    ChooseExerciseDependsOnSingleTextAnswer,
    ListenExerciseWithOptionsToChooseProps,
    ResultData
} from "../../interfaces.tsx";
import {useContext, useState} from "react";
import "../../sass/exercises/listen_exercise_with_options_to_choose.css";

import {handleSendChooseExerciseDependsOnSingleTextAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import {faVolumeUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const ListenExerciseWithOptionsToChoose = ({exercise, id, slug, onScore}: ListenExerciseWithOptionsToChooseProps) => {
    console.log("exercise", exercise)
    console.log("id", id)
    console.log("slug", slug)
    const [selectedOptions, setSelectedOptions] = useState<ChooseExerciseDependsOnSingleTextAnswer[]>([]);
    const playSound = (audio_url: string) => {
        console.log(import.meta.env.VITE_API_URL + audio_url)
        const audio = new Audio(audio_url);
        audio.play();
    };
    const [disableButton, setDisableButton] = useState<boolean>(false)
    const {token} = useContext(AuthContext);
    const [results, setResults] = useState<ResultData | undefined>()
    const [resultMode, setResultMode] = useState<boolean>(false)
    const sendAnswers = async () => {
        const answers = {"answers": selectedOptions}
        const path_slug = `${id}/${slug}`
        const result = await handleSendChooseExerciseDependsOnSingleTextAnswers(path_slug, answers, token)
        if (id !== undefined) {
            onScore(id.toString(), result.score, result.max_score)
        }
        setResults(result)
        setResultMode(true)
        console.log("result", result)
        console.log("send answers", answers)
        setDisableButton(true)
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
            <div className="lewotc__title">
            </div>
            <div className="lewotc__allexercises">
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
                            {/*<pre>{JSON.stringify(selectedOptions, null, 2)}</pre>*/}
                        </div>

                    )
                })}
            </div>
            <div className="lewotc__buttons">
                <button disabled={disableButton} className="greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>Send</button>
            </div>
        </section>
    );
};


export default ListenExerciseWithOptionsToChoose;
