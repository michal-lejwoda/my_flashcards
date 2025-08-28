import React from "react";
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
import "../../sass/exercises/multiple_exercises.css";

const MultipleExercises = ({playSound,exercise, onScore}: MultipleExercisesProps) => {


    const renderContent = (ex: Exercises) => {
        console.log("ex", ex)
        if (isMatchExercise(ex)) return <MatchExercise
            playSound = {playSound}
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={onScore}
        />;
        if (isChooseExerciseDependsOnMultipleTexts(ex)) return <ChooseExerciseDependsOnMultipleTexts
            playSound = {playSound}
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={onScore}
        />;
        if (isChooseExerciseDependsOnSingleText(ex)) return <ChooseExerciseDependsOnSingleText
            playSound = {playSound}
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={onScore}
        />;
        if (isConjugationExercise(ex)) return <ConjugationExercise
            playSound = {playSound}
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={onScore}
        />;
        if (isFillInTextExerciseWithChoices(ex)) return <FillInTextExerciseWithChoices
            playSound = {playSound}
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={onScore}
        />;
        if (isFillInTextExerciseWithChoicesWithImageDecoration(ex))
            return <FillInTextExerciseWithChoicesWithImageDecoration
                playSound = {playSound}
                exercise={ex}
                id={ex.id}
                slug={ex.slug}
                onScore={onScore}

            />;
        if (isFillInTextExerciseWithPredefinedBlocks(ex)) return <FillInTextExerciseWithPredefinedBlocks
            playSound = {playSound}
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={onScore}
        />;

        // if (isFlexibleExercisePage(ex)) return <FlexibleExercisePage
        //     exercise={ex}
        //     id={ex.id}
        //     slug={ex.slug}
        //     onScore={handleScoreUpdate}
        // />;
        if (isListenExerciseWithOptionsToChoose(ex)) return <ListenExerciseWithOptionsToChoose
            playSound = {playSound}
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={onScore}
        />;
        if (isListenWithManyOptionsToChooseToSingleExercise(ex))
            return <ListenWithManyOptionsToChooseToSingleExercise
                playSound = {playSound}
                exercise={ex}
                id={ex.id}
                slug={ex.slug}
                onScore={onScore}
            />;
        if (isMatchExerciseTextWithImage(ex)) return <MatchExerciseTextWithImage
            playSound = {playSound}
            exercise={ex}
            id={ex.id}
            slug={ex.slug}
            onScore={onScore}
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
