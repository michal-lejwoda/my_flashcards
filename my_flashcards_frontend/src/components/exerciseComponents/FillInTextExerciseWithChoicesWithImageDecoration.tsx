import React, {useContext, useState} from "react";
import {FillInTextExerciseWithChoicesWithImageDecorationProps} from "../../interfaces.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import {handleSendFillInTextExerciseWithChoicesAnswers} from "../../api.tsx";
import "../../sass/exercises/fill_in_text_exercise_with_choices_with_image_decoration.css";
import Select, {SingleValue} from "react-select";
import {customStyleforFillTextWithChoices} from "../../customFunctions.tsx";


const FillInTextExerciseWithChoicesWithImageDecoration = ({
                                                              exercise,
                                                              id,
                                                              slug,
                                                              onScore
                                                          }: FillInTextExerciseWithChoicesWithImageDecorationProps) => {
    type Answer = { blank_id: number; answer: string };
    type OptionType = {
        value: string;
        label: string;
    };
    const [disableButton, setDisableButton] = useState<boolean>(false)
    const [formData, setFormData] = useState<Answer[]>([]);
    const {token} = useContext(AuthContext);
    const textParts = exercise.text_with_blanks.split(/({{\d+}})/g);
    console.log("exercise", exercise)

    const sendAnswers = async () => {
        const answers = {"answers": formData}
        const path_slug = `${id}/${slug}`
        const result = await handleSendFillInTextExerciseWithChoicesAnswers(path_slug, answers, token)
        if (id !== undefined) {
            onScore(id.toString(), result.score, result.max_score)
        }
        setDisableButton(true)
        console.log(result)
        console.log("send answers", answers)
    }

    const handleChange = (selectedOption: SingleValue<OptionType>, blankId: number) => {
        if (selectedOption !== null) {
            setFormData(prev => {
                const existingIndex = prev.findIndex(item => item.blank_id === blankId);

                if (existingIndex !== -1) {
                    const updated = [...prev];
                    updated[existingIndex] = {blank_id: blankId, answer: selectedOption.value};
                    return updated;
                }

                return [...prev, {blank_id: blankId, answer: selectedOption.value}];
            });
        }
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
                <span>
                <Select
                    key={index}
                    name={String(blankId)}
                    options={selectOptions}
                    defaultValue={null}
                    onChange={(selectedOption) => handleChange(selectedOption, blankId)}
                    // onChange={handleChange}
                    styles={customStyleforFillTextWithChoices}
                />
                    </span>
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

                <div className="fitewc__container">
                    <div className="fitewc__description">{exercise.description}</div>
                    <div className="fitewc__text">
                        <div className="fitewc__image">
                            <img src={`${import.meta.env.VITE_API_URL}${exercise.image}`} alt={exercise.image}/>
                        </div>
                        <div className="fitewc__text--content">
                            {renderedText}
                        </div>
                    </div>
                </div>
            </div>
            <div className="fitewc__buttons">
                <button disabled={disableButton} className="greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>Send</button>
            </div>
        </section>
    );
};

export default FillInTextExerciseWithChoicesWithImageDecoration;
