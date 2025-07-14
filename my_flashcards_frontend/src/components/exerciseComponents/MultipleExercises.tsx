import React, {useState} from "react";
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

const MultipleExercises = ({exercise, onScore}: MultipleExercisesProps) => {
    console.log("exercise1", exercise)
    const [results, setResults] = useState<Record<string, number>>({});
    console.log("result", results)
    const handleScoreUpdate = (childId: string, score: number) => {
        setResults((prev) => {
            const updated = {...prev, [childId]: score};
            const total = Object.values(updated).reduce((sum, v) => sum + v, 0);
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
            onScore={handleScoreUpdate}
        />;
        if (isChooseExerciseDependsOnMultipleTexts(ex)) return <ChooseExerciseDependsOnMultipleTexts
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={handleScoreUpdate}
        />;
        if (isChooseExerciseDependsOnSingleText(ex)) return <ChooseExerciseDependsOnSingleText
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={handleScoreUpdate}
        />;
        if (isConjugationExercise(ex)) return <ConjugationExercise
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={handleScoreUpdate}
        />;
        if (isFillInTextExerciseWithChoices(ex)) return <FillInTextExerciseWithChoices
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={handleScoreUpdate}
        />;
        if (isFillInTextExerciseWithChoicesWithImageDecoration(ex))
            return <FillInTextExerciseWithChoicesWithImageDecoration
                exercise={ex}
                id={ex.id}
                slug={ex.slug}
                onScore={handleScoreUpdate}

            />;
        if (isFillInTextExerciseWithPredefinedBlocks(ex)) return <FillInTextExerciseWithPredefinedBlocks
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={handleScoreUpdate}/>;

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
