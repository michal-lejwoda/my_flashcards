import {
    ChooseExerciseDependsOnMultipleTextAnswer,
    ListenWithManyOptionsToChooseToSingleExerciseProps
} from "../../interfaces.tsx";
import {useContext, useState} from "react";
import {handleSendListenWithManyOptionsToChooseToSingleExerciseAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import "../../sass/exercises/listen_with_many_options_to_choose_to_single_exercise.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faVolumeUp} from "@fortawesome/free-solid-svg-icons";


const ListenWithManyOptionsToChooseToSingleExercise = ({
                                                           exercise,
                                                           id,
                                                           slug,
                                                           onScore
                                                       }: ListenWithManyOptionsToChooseToSingleExerciseProps) => {
    console.log("exercise", exercise)
    const [disableButton, setDisableButton] = useState<boolean>(false)
    const [selectedOptions, setSelectedOptions] = useState<ChooseExerciseDependsOnMultipleTextAnswer[]>([]);
    const playSound = (audio_url: string) => {
        console.log("http://0.0.0.0:8000" + audio_url)
        const audio = new Audio(audio_url);
        audio.play();
    };
    const {token} = useContext(AuthContext);
    const sendAnswers = async () => {
        const answers = {"answers": selectedOptions}
        console.log("answers", answers)
        const path_slug = `${id}/${slug}`
        const result = await handleSendListenWithManyOptionsToChooseToSingleExerciseAnswers(path_slug, answers, token)
        if (id !== undefined) {
            onScore(id.toString(), result.score, result.max_score)
        }
        console.log("result", result)
        console.log("send answers", answers)
        setDisableButton(true)
    }

    const handleOptionToggle = (questionId: string, option: string) => {
        setSelectedOptions(prev => {
            const exists = prev.find(item => item.question_id === questionId);

            if (exists) {
                const alreadyChosen = exists.answers.includes(option);

                return prev.map(item =>
                    item.question_id !== questionId
                        ? item
                        : {
                            ...item,
                            answers: alreadyChosen
                                ? item.answers.filter(ans => ans !== option)
                                : [...item.answers, option],
                        },
                );
            }

            return [...prev, {question_id: questionId, answers: [option]}];
        });
    };

    return (
        <section className="lewotc">
            <div className="lewotc__title">
                <h1>ListenExerciseWithOptionsToChooseToSingleExercise</h1>
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
                                {element.options.map(answer => {
                                    const filteredOptions = selectedOptions.filter(el => el.question_id == element.question_id)
                                    let isSelected = false
                                    if (filteredOptions.length > 0) {
                                        isSelected = filteredOptions[0].answers.includes(answer)
                                    }
                                    return (
                                        <div
                                            className={`cdost__option ${isSelected ? "cdost__option--selected" : ""}`}
                                            key={`${element.question_id}-${answer}`}
                                            onClick={() => handleOptionToggle(element.question_id, answer)}
                                        >
                                            {answer}
                                        </div>
                                    )
                                })}
                            </div>

                        </div>

                    )
                })}
            </div>
            {/*<pre>{JSON.stringify(selectedOptions, null, 2)}</pre>*/}
            <div className="lewotc__buttons">
                <button disabled={disableButton} className="greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>Send</button>
            </div>
        </section>
    );
};


export default ListenWithManyOptionsToChooseToSingleExercise;
