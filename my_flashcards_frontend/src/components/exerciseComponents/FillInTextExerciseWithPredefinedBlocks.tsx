import {
    FillInTextExerciseWithPredefinedBlocksDataBlocks,
    FillInTextExerciseWithPredefinedBlocksProps
} from "../../interfaces.tsx";
import React, {useContext, useState} from "react";
import AuthContext from "../../context/AuthContext.tsx";
import {handleSendFillInTextExerciseWithPredefinedBlocks} from "../../api.tsx";

const FillInTextExerciseWithPredefinedBlocks = ({exercise, id, slug, onScore}: FillInTextExerciseWithPredefinedBlocksProps) => {
    console.log("exercise", exercise)
    const [formData, setFormData] = useState<FillInTextExerciseWithPredefinedBlocksDataBlocks[]>([]);
    const {token} = useContext(AuthContext);
    const textParts = exercise.text_with_blanks.split(/({{\d+}})/g);

    const sendAnswers = async () => {
        const answers = {"answers": formData}
        const path_slug = `${id}/${slug}`
        const result = handleSendFillInTextExerciseWithPredefinedBlocks(path_slug, answers, token)
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
                >
                </input>
            );
        } else {
            return <React.Fragment key={index}>{part}</React.Fragment>;
        }
    });

    return (
        <div>
            <h1>FillInTextExerciseWithChoices</h1>
            <p>{exercise.text_with_blanks}</p>
            {renderedText}
            <pre>{JSON.stringify(formData, null, 2)}</pre>
            <div>
                <button onClick={sendAnswers}>Send</button>
            </div>
        </div>
    );
};

export default FillInTextExerciseWithPredefinedBlocks;
