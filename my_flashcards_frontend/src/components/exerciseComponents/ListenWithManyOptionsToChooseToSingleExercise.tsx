import {
    ChooseExerciseDependsOnMultipleTextAnswer,
    ListenWithManyOptionsToChooseToSingleExerciseProps
} from "../../interfaces.tsx";
import {useContext, useState} from "react";
import {handleSendListenWithManyOptionsToChooseToSingleExerciseAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import "../../sass/exercises/listen_with_many_options_to_choose_to_single_exercise.css";


const ListenWithManyOptionsToChooseToSingleExercise = ({
                                                           exercise,
                                                           id,
                                                           slug,
                                                           onScore
                                                       }: ListenWithManyOptionsToChooseToSingleExerciseProps) => {
    console.log("exercise", exercise)
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
        <div>
            <h1>ListenExerciseWithOptionsToChoose</h1>
            {exercise.exercises.map(element => {
                return (
                    <>
                        <div key={element.question_id}>
                            {element.question}
                            <button onClick={() => playSound(exercise.audio)}>Zagraj dźwięk</button>
                        </div>
                        <div>
                            {element.options.map(answer => (
                                <div
                                    key={`${element.question_id}-${answer}`}
                                    onClick={() => handleOptionToggle(element.question_id, answer)}
                                >
                                    {answer}
                                </div>
                            ))}
                        </div>

                    </>

                )
            })}
            <pre>{JSON.stringify(selectedOptions, null, 2)}</pre>
            <button onClick={sendAnswers}></button>
        </div>
    );
};


export default ListenWithManyOptionsToChooseToSingleExercise;
