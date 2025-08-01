import {
    FillInTextExerciseWithPredefinedBlocksDataBlocks,
    FillInTextExerciseWithPredefinedBlocksProps
} from "../../interfaces.tsx";
import React, {useContext, useState} from "react";
import AuthContext from "../../context/AuthContext.tsx";
import {handleSendFillInTextExerciseWithPredefinedBlocks} from "../../api.tsx";
import "../../sass/exercises/fill_in_text_exercise_with_predefined_blocks.css"


const FillInTextExerciseWithPredefinedBlocks = ({exercise, id, slug, onScore}: FillInTextExerciseWithPredefinedBlocksProps) => {
    console.log("exercise", exercise)
    const [formData, setFormData] = useState<FillInTextExerciseWithPredefinedBlocksDataBlocks[]>([]);
    const {token} = useContext(AuthContext);
    const textParts = exercise.text_with_blanks.split(/({{\d+}})/g);

    const sendAnswers = async () => {
        const answers = {"answers": formData}
        const path_slug = `${id}/${slug}`
        const result = await handleSendFillInTextExerciseWithPredefinedBlocks(path_slug, answers, token)

        if (id !== undefined){
            onScore(id.toString(), result.score, result.max_score)
        }
        console.log("result", result)
        console.log("send answers", answers)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const blankId = Number(e.target.name);
        const value = e.target.value;

        setFormData(prev => {
            const existingIndex = prev.findIndex(item => item.blank_id === blankId);

            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = {blank_id: blankId, answer: value};
                return updated;
            }

            return [...prev, {blank_id: blankId, answer: value}];
        });
    };

    const renderedText = textParts.map((part, index) => {
        const match = part.match(/{{(\d+)}}/);
        if (match) {
            const blankId = Number(match[1]);
            // const options = exercise.blocks.find(blank => blank.blank_id === blankId);

            return (
                <input
                    key={index}
                    name={String(blankId)}
                    onChange={handleChange}
                    style={{margin: '0 4px'}}
                    defaultValue=""
                    className="fitewc--select"
                >
                </input>
            );
        } else {
            return <React.Fragment key={index}>{part}</React.Fragment>;
        }
    });

    return (
        <section className="fitewc">
            <div className="fitewc__content">
                <div className="fitewc__title">
                    <h1>FillInTextExerciseWithPredefinedBlocks</h1>
                </div>

                {/*<p>{exercise.text_with_blanks}</p>*/}
                <div className="fitewc__container">
                    <div className="fitewc__description">{exercise.description}</div>
                    <div className="fitewc__text">
                        <div className="fitew__text--content">
                            {renderedText}
                        </div>
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

export default FillInTextExerciseWithPredefinedBlocks;
