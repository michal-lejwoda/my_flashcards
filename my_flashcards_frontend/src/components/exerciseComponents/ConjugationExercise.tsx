import {ConjugationExerciseAnswer, ConjugationExerciseProps} from "../../interfaces.tsx";
import {useContext, useState} from "react";
import {handleSendConjugationExerciseAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import "../../sass/exercises/conjugation_exercise.css"

const ConjugationExercise = ({exercise, id, slug, onScore}: ConjugationExerciseProps) => {
    console.log("exercise", exercise)
    const [formData, setFormData] = useState<ConjugationExerciseAnswer[]>(() =>
        exercise.conjugation_rows.reduce((acc, row) => {
            if (!row.is_pre_filled && row.person_label) {
                acc.push({person_label: row.person_label, answer: ''});
            }
            return acc;
        }, [] as ConjugationExerciseAnswer[])
    );
    const [disableButton, setDisableButton] = useState<boolean>(false)
    const {token} = useContext(AuthContext);
    const sendAnswers = async () => {
        const answers = {"answers": formData}
        const path_slug = `${id}/${slug}`
        const result = await handleSendConjugationExerciseAnswers(path_slug, answers, token)
        if (id !== undefined) {
            onScore(id.toString(), result.score, result.max_score)
        }
        setDisableButton(true)
        console.log(result)
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
        <section className="conjugation-exercise">
            <div className="conjugation-exercise__container">
                <div className="conjugation-exercise__title">
                    <h1>Conjugation Exercise</h1>
                </div>
                <div className="conjugation-exercise__rowscontainer">
                    <div className="conjugation-exercise__name">{exercise.instruction}</div>
                    <div className="conjugation-exercise__rowcenter">

                        {exercise.conjugation_rows.map(element => {
                            return (
                                <div className="conjugation-exercise__row" key={element.person_label}>
                                    <div className="conjugation-exercise__person-label">{element.person_label}</div>
                                    {element.is_pre_filled ? <input className="conjugation-exercise__input" type="text" value={element.correct_form} disabled /> :
                                        <input className="conjugation-exercise__input" name={element.person_label} onChange={handleChange} type="text"/>}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="conjugationexercise__buttons ">
                    <button disabled={disableButton}  className="greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>Send</button>
                </div>
            </div>
        </section>
    );
};

export default ConjugationExercise;
