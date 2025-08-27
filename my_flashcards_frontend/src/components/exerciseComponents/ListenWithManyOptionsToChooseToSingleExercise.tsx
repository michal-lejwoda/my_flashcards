import {
    ChooseExerciseDependsOnMultipleTextAnswer,
    ListenWithManyOptionsToChooseToSingleExerciseProps, ResultData
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
    const [results, setResults] = useState<ResultData | undefined>()
    const [resultMode, setResultMode] = useState<boolean>(false)
    const playSound = (audio_url: string) => {
        const audio = new Audio(import.meta.env.VITE_API_URL + audio_url);
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
        setResults(result)
        setResultMode(true)
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

    const getOptionClassName = (questionId: string, option: string): string => {
        console.log("questionId", questionId)
        console.log("option", option)

        const selectedAnswersForQuestion = selectedOptions.find(opt => opt.question_id === questionId);
        const isSelected = selectedAnswersForQuestion ? selectedAnswersForQuestion.answers.includes(option) : false;

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
                const correctAnswers = Array.isArray(resultAnswer.correct_answer)
                    ? resultAnswer.correct_answer
                    : [resultAnswer.correct_answer];

                const isCorrectOption = correctAnswers.includes(option);

                if (isSelected && isCorrectOption) {
                    className += " cdost__option--correct";
                } else if (isSelected && !isCorrectOption) {
                    className += " cdost__option--incorrect";
                } else if (!isSelected && isCorrectOption) {
                    className += " cdost__option--incorrect";
                }
            }
        }

        return className;
    };



    return (
        <section className="lewotc">
            <div className="lewotc__title">
                <h1>ListenExerciseWithOptionsToChooseToSingleExercise</h1>
            </div>
            <div className="lewotc__allexercises">
                {exercise.exercises.map(element => {
                    return (
                        <div className="lewotc__singleexercise" key={element.question_id}>
                            <div className="lewotc__questioncontainer">
                                <div className="lewotc__question">{element.question}</div>
                                <div className="lewotc--soundbutton" onClick={() => playSound(element.audio)}>
                                    <FontAwesomeIcon
                                        size="lg" icon={faVolumeUp}/></div>
                            </div>
                            <div className="lewotc__options">
                                {element.options.map(answer => {
                                    return (
                                        <div
                                            className={getOptionClassName(element.question_id, answer)}
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
