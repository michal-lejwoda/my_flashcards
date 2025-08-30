import {
    FillInTextExerciseWithPredefinedBlocksDataBlocks,
    FillInTextExerciseWithPredefinedBlocksProps
} from "../../interfaces.tsx";
import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../../context/AuthContext.tsx";
import {handleSendFillInTextExerciseWithPredefinedBlocks} from "../../api.tsx";
import "../../sass/exercises/fill_in_text_exercise_with_predefined_blocks.css"
import {useExerciseContext} from "../ExerciseContext.tsx";
import {useTranslation} from "react-i18next";

const FillInTextExerciseWithPredefinedBlocks = ({playSound, exercise, id, slug, onScore}: FillInTextExerciseWithPredefinedBlocksProps) => {
    const [formData, setFormData] = useState<FillInTextExerciseWithPredefinedBlocksDataBlocks[]>([]);
    const {token} = useContext(AuthContext);
    const textParts = exercise.text_with_blanks.split(/({{\d+}})/g);
    const [disableButton, setDisableButton] = useState<boolean>(false)
    const [resultMode, setResultMode] = useState<boolean>(false)
    const { shouldCheckAll, resetCheckAll } = useExerciseContext();
    const {t} = useTranslation();
    useEffect(() => {
        if (shouldCheckAll && !resultMode && !disableButton) {
            sendAnswers();
            resetCheckAll();
        }
    }, [shouldCheckAll, resultMode, disableButton]);


    const sendAnswers = async () => {
        if (disableButton || resultMode) return;
        const answers = {"answers": formData}
        const path_slug = `${id}/${slug}`
        const result = await handleSendFillInTextExerciseWithPredefinedBlocks(path_slug, answers, token)

        if (id !== undefined){
            onScore(id.toString(), result.score, result.max_score)
        }
        setDisableButton(true)
        setResultMode(true)
        if (result.score == result.max_score){
            playSound('/RightAnswer.mp3')
        }else{
            playSound('/WrongAnswer.mp3')
        }
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

    const renderTextWithLineBreaks = (text: string, keyPrefix: string) => {
        return text.split('\n').map((line, lineIndex) => (
            <React.Fragment key={`${keyPrefix}-line-${lineIndex}`}>
                {line}
                {lineIndex < text.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    const renderedText = textParts.map((part, index) => {
        const match = part.match(/{{(\d+)}}/);

        if (resultMode) {
            if (match) {
                const blankId = Number(match[1]);

                const answer = exercise.correct_answers.find(
                    (element) => element.blank_id === blankId
                );

                const userAnswer = formData.find(
                    (element) => element.blank_id === blankId
                );

                const isCorrect = userAnswer?.answer === answer?.answer;

                return (
                    <span key={index}>
                        {isCorrect ? (
                            <span className="fitewc--correct">{userAnswer?.answer}</span>
                        ) : (
                            <>
                                <span className="fitewc--wrong">{userAnswer?.answer}</span>
                                <span className="fitewc--correct-answer">
                                    {answer?.answer}
                                </span>
                            </>
                        )}
                    </span>
                );
            } else {
                return (
                    <React.Fragment key={index}>
                        {renderTextWithLineBreaks(part, `result-${index}`)}
                    </React.Fragment>
                );
            }
        } else {
            if (match) {
                const blankId = Number(match[1]);
                return (
                    <input
                        key={index}
                        name={String(blankId)}
                        onChange={handleChange}
                        style={{ margin: "0 4px" }}
                        defaultValue=""
                        className="fitewc--select"
                    />
                );
            } else {
                return (
                    <React.Fragment key={index}>
                        {renderTextWithLineBreaks(part, `normal-${index}`)}
                    </React.Fragment>
                );
            }
        }
    });

    return (
        <section className="fitewc">
            <div className="fitewc__content">
                <div className="fitewc__container">
                    <div className="fitewc__description">{t("exercise.description")}</div>
                    <div className="fitewc__text">
                        <div className="fitewc__text--content">
                            {renderedText}
                        </div>
                    </div>
                </div>
            </div>
            <div className="fitewc__buttons">
                <button disabled={disableButton} className="greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>{resultMode ? t('Checked') : t('Check')}</button>
            </div>
        </section>
    );
};

export default FillInTextExerciseWithPredefinedBlocks;
