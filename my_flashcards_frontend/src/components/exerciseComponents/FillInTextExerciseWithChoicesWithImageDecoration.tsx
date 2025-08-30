import React, {useContext, useEffect, useState} from "react";
import {FillInTextExerciseWithChoicesWithImageDecorationProps, ResultDataWithBlankId} from "../../interfaces.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import {handleSendFillInTextExerciseWithChoicesAnswers} from "../../api.tsx";
import "../../sass/exercises/fill_in_text_exercise_with_choices_with_image_decoration.css";
import Select, {SingleValue} from "react-select";
import {customStyleforFillTextWithChoices} from "../../customFunctions.tsx";
import {useExerciseContext} from "../ExerciseContext.tsx";
import {useTranslation} from "react-i18next";


const FillInTextExerciseWithChoicesWithImageDecoration = ({
                                                                playSound,
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
    const [results, setResults] = useState<ResultDataWithBlankId | undefined>()
    const [resultMode, setResultMode] = useState<boolean>(false)
    const textParts = exercise.text_with_blanks.split(/({{\d+}})/g);
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
        const result = await handleSendFillInTextExerciseWithChoicesAnswers(path_slug, answers, token)
        setResults(result)
        setResultMode(true)
        if (id !== undefined) {
            onScore(id.toString(), result.score, result.max_score)
        }
        setDisableButton(true)
        if (result.score == result.max_score){
            playSound('/RightAnswer.mp3')
        }else{
            playSound('/WrongAnswer.mp3')
        }
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

    const isAnswerCorrect = (blankId: number) => {
        if (!results || !results.result_answers) return null;
        const result = results.result_answers.find(r => r.blank_id === blankId);
        return result ? result.correct : null;
    };

    const getCorrectAnswer = (blankId: number) => {
        if (!results || !results.result_answers) return null;
        const result = results.result_answers.find(r => r.blank_id === blankId);
        return result ? result.correct_answer : null;
    };

    const getSelectedAnswer = (blankId: number) => {
        const answer = formData.find(item => item.blank_id === blankId);
        return answer ? answer.answer : null;
    };

    const getSelectStyles = (blankId: number) => {
        if (!resultMode) return customStyleforFillTextWithChoices;

        const isCorrect = isAnswerCorrect(blankId);
        if (isCorrect === null) return customStyleforFillTextWithChoices;

        return {
            ...customStyleforFillTextWithChoices,
            // @ts-expect-error Custom styles
            control: (provided, state) => ({
                ...customStyleforFillTextWithChoices.control?.(provided, state) || provided,
                borderColor: isCorrect ? '#10B981' : '#EF4444',
                backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                borderWidth: '2px',
                '&:hover': {
                    borderColor: isCorrect ? '#10B981' : '#EF4444'
                }
            })
        };
    };

    const renderedText = textParts.map((part, index) => {
        const match = part.match(/{{(\d+)}}/);
        if (match) {
            const blankId = Number(match[1]);
            const blankData = exercise.blanks.find(blank => blank.blank_id === blankId);
            if (!blankData) {
                return null;
            }
            const selectOptions = blankData.options.map(opt => ({
                value: opt,
                label: opt
            }));

            const selectedAnswer = getSelectedAnswer(blankId);
            const isCorrect = isAnswerCorrect(blankId);
            const correctAnswer = getCorrectAnswer(blankId);

            return (
                <React.Fragment key={index}>
                    <Select
                        name={String(blankId)}
                        options={selectOptions}
                        defaultValue={selectedAnswer ? {value: selectedAnswer, label: selectedAnswer} : null}
                        onChange={(selectedOption) => handleChange(selectedOption, blankId)}
                        styles={getSelectStyles(blankId)}
                        isDisabled={disableButton}
                    />
                    {resultMode && isCorrect === false && correctAnswer && (
                        <span className="fitewc__corrected-answer">
                            ({t("Poprawna odpowiedź")}: {correctAnswer})
                        </span>
                    )}
                </React.Fragment>
            );
        } else {
            const lines = part.split('\n');
            return (
                <React.Fragment key={index}>
                    {lines.map((line, lineIndex) => (
                        <React.Fragment key={lineIndex}>
                            {line}
                            {lineIndex < lines.length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </React.Fragment>
            );
        }
    });

    return (
        <section className="fitewc">
            <div className="fitewc__content">
                <div className="fitewc__container">
                    <div className="fitewc__description">{t("exercise.description")}</div>
                    <div className="fitewc__text">
                        <div className="fitewc__image">
                            <img src={`${import.meta.env.VITE_API_URL}${exercise.image}`} alt={exercise.image}/>
                        </div>
                        <div className="fitew__text--content">
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

export default FillInTextExerciseWithChoicesWithImageDecoration;
