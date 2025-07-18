import React, {useEffect, useState} from "react";
import {
    Exercises,
    isChooseExerciseDependsOnMultipleTexts,
    isChooseExerciseDependsOnSingleText,
    isConjugationExercise,
    isFillInTextExerciseWithChoices,
    isFillInTextExerciseWithChoicesWithImageDecoration,
    isFillInTextExerciseWithPredefinedBlocks,
    isListenExerciseWithOptionsToChoose,
    isListenWithManyOptionsToChooseToSingleExercise,
    isMatchExercise,
    isMatchExerciseTextWithImage,
    MultipleExercisesProps,
} from "../../interfaces.tsx";

import MatchExercise from "./MatchExercise.tsx";
import ChooseExerciseDependsOnMultipleTexts from "./ChooseExerciseDependsOnMultipleTexts.tsx";
import ChooseExerciseDependsOnSingleText from "./ChooseExerciseDependsOnSingleText.tsx";
import ConjugationExercise from "./ConjugationExercise.tsx";
import FillInTextExerciseWithChoices from "./FillInTextExerciseWithChoices.tsx";
import FillInTextExerciseWithChoicesWithImageDecoration from "./FillInTextExerciseWithChoicesWithImageDecoration.tsx";
import FillInTextExerciseWithPredefinedBlocks from "./FillInTextExerciseWithPredefinedBlocks.tsx";
import ListenExerciseWithOptionsToChoose from "./ListenExerciseWithOptionsToChoose.tsx";
import ListenWithManyOptionsToChooseToSingleExercise from "./ListenWithManyOptionsToChooseToSingleExercise.tsx";
import MatchExerciseTextWithImage from "./MatchExerciseTextWithImage.tsx";

interface ExerciseScore {
    id: string;
    score: number;
    maxScore: number;
    completed: boolean;
}

const MultipleExercises = ({exercise, onScore}: MultipleExercisesProps) => {
    const [results, setResults] = useState<Record<string, ExerciseScore>>({});
    const [totalScore, setTotalScore] = useState(0);
    const [maxTotalScore, setMaxTotalScore] = useState(0);
    const [completedExercises, setCompletedExercises] = useState(0);
    console.log("results", results)
    console.log("totalScore",totalScore)
    console.log("maxTotalScore",maxTotalScore)
    console.log("CompletedExercises", completedExercises)

    useEffect(() => {
        const initialResults: Record<string, ExerciseScore> = {};
        let maxTotal = 0;

        exercise.exercises.forEach((ex) => {
            const exerciseId = ex.id ?? ex.slug;
            // const maxScore = getMaxScoreForExercise(ex);
            // maxTotal += maxScore;

            initialResults[exerciseId] = {
                id: exerciseId.toString(),
                score: 0,
                maxScore: 0,
                completed: false
            };
        });

        setResults(initialResults);
        setMaxTotalScore(maxTotal);
    }, [exercise.exercises]);


    const handleScoreUpdate = (childId: string, score: number, maxScore?: number, completed: boolean = false) => {
        setResults((prev) => {
            const updated = {...prev};
            updated[childId] = {
                ...updated[childId],
                score: score,
                maxScore: maxScore || updated[childId].maxScore,
                completed: completed
            };

            const total = Object.values(updated).reduce((sum, result) => sum + result.score, 0);
            const maxTotal = Object.values(updated).reduce((sum, result) => sum + result.maxScore, 0);
            const completedCount = Object.values(updated).filter(result => result.completed).length;

            setTotalScore(total);
            setMaxTotalScore(maxTotal);
            setCompletedExercises(completedCount);

            onScore?.(total);

            return updated;
        });
    };

    const renderContent = (ex: Exercises) => {
        console.log("ex", ex)
        if (isMatchExercise(ex)) return <MatchExercise
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={(id, score, maxScore, completed) => handleScoreUpdate(id, score, maxScore, completed)}
        />;
        if (isChooseExerciseDependsOnMultipleTexts(ex)) return <ChooseExerciseDependsOnMultipleTexts
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={(id, score, maxScore, completed) => handleScoreUpdate(id, score, maxScore, completed)}
        />;
        if (isChooseExerciseDependsOnSingleText(ex)) return <ChooseExerciseDependsOnSingleText
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={(id, score, maxScore, completed) => handleScoreUpdate(id, score, maxScore, completed)}
        />;
        if (isConjugationExercise(ex)) return <ConjugationExercise
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={(id, score, maxScore, completed) => handleScoreUpdate(id, score, maxScore, completed)}
        />;
        if (isFillInTextExerciseWithChoices(ex)) return <FillInTextExerciseWithChoices
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={(id, score, maxScore, completed) => handleScoreUpdate(id, score, maxScore, completed)}
        />;
        if (isFillInTextExerciseWithChoicesWithImageDecoration(ex))
            return <FillInTextExerciseWithChoicesWithImageDecoration
                exercise={ex}
                id={ex.id}
                slug={ex.slug}
                onScore={(id, score, maxScore, completed) => handleScoreUpdate(id, score, maxScore, completed)}

            />;
        if (isFillInTextExerciseWithPredefinedBlocks(ex)) return <FillInTextExerciseWithPredefinedBlocks
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={(id, score, maxScore, completed) => handleScoreUpdate(id, score, maxScore, completed)}
        />;

        // if (isFlexibleExercisePage(ex)) return <FlexibleExercisePage
        //     exercise={ex}
        //     id={ex.id}
        //     slug={ex.slug}
        //     onScore={handleScoreUpdate}
        // />;
        if (isListenExerciseWithOptionsToChoose(ex)) return <ListenExerciseWithOptionsToChoose
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={handleScoreUpdate}
        />;
        if (isListenWithManyOptionsToChooseToSingleExercise(ex))
            return <ListenWithManyOptionsToChooseToSingleExercise
                exercise={ex}
                id={ex.id}
                slug={ex.slug}
                onScore={handleScoreUpdate}
            />;
        if (isMatchExerciseTextWithImage(ex)) return <MatchExerciseTextWithImage
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={handleScoreUpdate}
        />;

        return <h1>404</h1>;
    };

    return (
        <div>
            {exercise.exercises.map((ex) => (
                <React.Fragment key={ex.id ?? ex.slug}>
                    {renderContent(ex)}
                </React.Fragment>
            ))}
        </div>
    );
};

export default MultipleExercises;
