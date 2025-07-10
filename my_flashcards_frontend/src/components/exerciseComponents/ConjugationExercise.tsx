import {ConjugationExerciseAnswer, ConjugationExerciseProps} from "../../interfaces.tsx";
import {useContext, useState} from "react";
import {handleSendConjugationExerciseAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";

const ConjugationExercise = ({exercise, id, slug}: ConjugationExerciseProps) => {
    console.log("exercise", exercise)
    const [formData, setFormData] = useState<ConjugationExerciseAnswer[]>(() =>
        exercise.conjugation_rows.reduce((acc, row) => {
            if (!row.is_pre_filled && row.person_label) {
                acc.push({person_label: row.person_label, answer: ''});
            }
            return acc;
        }, [] as ConjugationExerciseAnswer[])
    );

    const {token} = useContext(AuthContext);
    const sendAnswers = () => {
        const answers = {"answers": formData}
        const path_slug = `${id}/${slug}`
        handleSendConjugationExerciseAnswers(path_slug, answers, token)
        console.log("send answers", answers)
    }
    console.log(formData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData(prev =>
            prev.map(row =>
                row.person_label === name ? {...row, answer: value} : row
            )
        );
    };

    return (
        <div>
            <h1>Conjugation Exercise</h1>
            {exercise.conjugation_rows.map(element => {
                return (
                    <div key={element.person_label}>
                        <div>{element.person_label}</div>
                        {element.is_pre_filled ? <div>{element.correct_form}</div> :
                            <input name={element.person_label} onChange={handleChange} type="text"/>}
                    </div>
                )
            })}
            <div className="conjugationexercise__buttons">
                <button onClick={sendAnswers}>Send</button>
            </div>
        </div>
    );
};

export default ConjugationExercise;
