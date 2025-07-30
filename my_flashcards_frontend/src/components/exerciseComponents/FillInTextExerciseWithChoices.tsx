import React, {useContext, useState} from "react";
import {FillInTextExerciseWithChoicesProps} from "../../interfaces.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import {handleSendFillInTextExerciseWithChoicesAnswers} from "../../api.tsx";
import "../../sass/exercises/fill_in_text_exercise_with_choices.css"
import Select from "react-select";
import {customStyleforFillTextWithChoices} from "../../customFunctions.tsx";
import {SingleValue} from "react-select";

const FillInTextExerciseWithChoices = ({exercise, id, slug, onScore}: FillInTextExerciseWithChoicesProps) => {
    type Answer = { blank_id: number; answer: string };
    type OptionType = {
  value: string;
  label: string;
};
    const [formData, setFormData] = useState<Answer[]>([]);
    const {token} = useContext(AuthContext);
    const textParts = exercise.text_with_blanks.split(/({{\d+}})/g);

    const sendAnswers = async () => {
        const answers = {"answers": formData}
        const path_slug = `${id}/${slug}`
        const result = await handleSendFillInTextExerciseWithChoicesAnswers(path_slug, answers, token)
        if (id !== undefined) {
            onScore(id.toString(), result.score, result.max_score)
        }
        console.log(result)
        console.log("send answers", answers)
    }

    const handleChange = (selectedOption:SingleValue<OptionType>, blankId: number) => {
        // const blankId = Number(e.target.name);
        // const value = e.target.value;

        if (selectedOption !== null){
        setFormData(prev => {
            const existingIndex = prev.findIndex(item => item.blank_id === blankId);

            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = {blank_id: blankId, answer: selectedOption.value};
                return updated;
            }

            return [...prev, {blank_id: blankId, answer: selectedOption.value}];
        });}
    };

    const renderedText = textParts.map((part, index) => {
        const match = part.match(/{{(\d+)}}/);
        if (match) {
            const blankId = Number(match[1]);
            // const options = exercise.blanks.find(blank => blank.blank_id === blankId);
            const blankData = exercise.blanks.find(blank => blank.blank_id === blankId);
            if (!blankData) {
              return null;
}
            const selectOptions = blankData.options.map(opt => ({
                value: opt,
                label: opt
            }));

            return (
                <Select
                    key={index}
                    name={String(blankId)}
                    options={selectOptions}
                    defaultValue={null}
                    onChange={(selectedOption) => handleChange(selectedOption, blankId)}
                    // onChange={handleChange}
                    styles={customStyleforFillTextWithChoices}
                />
                // <select
                //     key={index}
                //     name={String(blankId)}
                //     className="fitewc__select"
                //     onChange={handleChange}
                //     style={{margin: '0 4px'}}
                //     defaultValue=""
                // >
                //     <option className="fitewc__select--option" value="" disabled hidden>-- wybierz --</option>
                //     {options?.options.map((option: string, optIndex: number) => (
                //         <option className="fitewc__select--option" key={optIndex} value={option}>{option}</option>
                //     ))}
                // </select>
            );
        } else {
            return <React.Fragment key={index}>{part}</React.Fragment>;
        }
    });

    return (
        <section className="fitewc">
            <div className="fitewc__content">
                <div className="fitewc__title">
                    <h1>FillInTextExerciseWithChoices</h1>
                </div>
                <div className="fitewc__description"></div>
                {/*<p>{exercise.text_with_blanks}</p>*/}
                <div className="fitewc__container">
                    <div className="fitewc__text">
                        {renderedText}
                    </div>
                </div>
            </div>
            {/*<pre>{JSON.stringify(formData, null, 2)}</pre>*/}
            <div className="fitewc__buttons">
                <button className="greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>Send</button>
            </div>
        </section>
    );
};

export default FillInTextExerciseWithChoices;
