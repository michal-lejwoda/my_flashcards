import {ChooseExerciseDependsOnSingleTextAnswer, ListenExerciseWithOptionsToChooseProps} from "../../interfaces.tsx";
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
        console.log("http://0.0.0.0:8000" + audio_url)
        const audio = new Audio(audio_url);
        audio.play();
    };
    const {token} = useContext(AuthContext);
    const sendAnswers = async () => {
        const answers = {"answers": selectedOptions}
        const path_slug = `${id}/${slug}`
        const result = await handleSendChooseExerciseDependsOnSingleTextAnswers(path_slug, answers, token)
        if (id !== undefined) {
            onScore(id.toString(), result.score, result.max_score)
        }
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

    return (
        <section className="lewotc">
            <div className="lewotc__title">
                <h1>ListenExerciseWithOptionsToChoose sdds</h1>
            </div>
            <div className="lewotc__allexercises">
                {exercise.exercises.map(element => {
                    const selectedAnswer = selectedOptions.find(opt => opt.question_id === element.question_id)?.answer;

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
                                    const isSelected = selectedAnswer === answer;
                                    return (
                                        <div
                                            className={`cdost__option ${isSelected ? "cdost__option--selected" : ""}`}
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
            <button onClick={sendAnswers}></button>
        </section>
    );
};


export default ListenExerciseWithOptionsToChoose;
