import {ChooseExerciseDependsOnSingleTextAnswer, ListenExerciseWithOptionsToChooseProps} from "../../interfaces.tsx";
import {useContext, useState} from "react";
import {handleSendChooseExerciseDependsOnSingleTextAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";


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
        if (id !== undefined){
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
        <div>
            <h1>ListenExerciseWithOptionsToChoose</h1>
            {exercise.exercises.map(element => {
                const selectedAnswer = selectedOptions.find(opt => opt.question_id === element.question_id)?.answer;

                return (
                    <>
                        <div key={element.question_id}>
                            {element.question}
                            <button onClick={() => playSound(exercise.audio)}>Zagraj dźwięk</button>
                        </div>
                        <div>
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
                        <pre>{JSON.stringify(selectedOptions, null, 2)}</pre>
                    </>

                )
            })}
            <button onClick={sendAnswers}></button>
        </div>
    );
};


export default ListenExerciseWithOptionsToChoose;
