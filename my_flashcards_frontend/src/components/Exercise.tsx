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
    isMatchExerciseTextWithImage, isMultipleExercises
} from "../interfaces.tsx";
import MatchExercise from "./exerciseComponents/MatchExercise.tsx";
import {useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {handleGetExercise} from "../api.tsx";
import ChooseExerciseDependsOnMultipleTexts from "./exerciseComponents/ChooseExerciseDependsOnMultipleTexts.tsx";
import ChooseExerciseDependsOnSingleText from "./exerciseComponents/ChooseExerciseDependsOnSingleText.tsx";
import ConjugationExercise from "./exerciseComponents/ConjugationExercise.tsx";
import FillInTextExerciseWithChoices from "./exerciseComponents/FillInTextExerciseWithChoices.tsx";
import FillInTextExerciseWithChoicesWithImageDecoration
    from "./exerciseComponents/FillInTextExerciseWithChoicesWithImageDecoration.tsx";
import FillInTextExerciseWithPredefinedBlocks from "./exerciseComponents/FillInTextExerciseWithPredefinedBlocks.tsx";
import ListenExerciseWithOptionsToChoose from "./exerciseComponents/ListenExerciseWithOptionsToChoose.tsx";
import ListenWithManyOptionsToChooseToSingleExercise
    from "./exerciseComponents/ListenWithManyOptionsToChooseToSingleExercise.tsx";
import MatchExerciseTextWithImage from "./exerciseComponents/MatchExerciseTextWithImage.tsx";
import MultipleExercises from "./exerciseComponents/MultipleExercises.tsx";

const Exercise = () => {
    const { id: idParam, slug } = useParams<{ id: string; slug: string }>();
const id = idParam ? parseInt(idParam, 10) : undefined;
    const [exercise, setExercise] = useState<Exercises | null>(null);
    const [results, setResults] = useState<Record<string, number>>({});

    const handleScoreUpdate = useCallback((exerciseId: string, score: number) => {
        setResults((prev) => ({...prev, [exerciseId]: score}));
    }, []);

    const totalScore = Object.values(results).reduce((s, v) => s + v, 0);

    useEffect(() => {
        const fetchExercise = async () => {
            const result = await handleGetExercise(id, slug);
            setExercise(result);
        };
        fetchExercise();
    }, [id, slug]);

    const renderContent = () => {
        if (!exercise) return null;


        if (isMatchExercise(exercise)) return <MatchExercise exercise={exercise}
                                                             id={id}
                                                             slug={slug}
                                                             onScore={handleScoreUpdate}
        />;
        if (isChooseExerciseDependsOnMultipleTexts(exercise)) return <ChooseExerciseDependsOnMultipleTexts
            exercise={exercise}
            id={id}
            slug={slug}
            onScore={handleScoreUpdate}/>;
        if (isChooseExerciseDependsOnSingleText(exercise)) return <ChooseExerciseDependsOnSingleText
            exercise={exercise}
            id={id}
            slug={slug}
            onScore={handleScoreUpdate}
        />;
        if (isConjugationExercise(exercise)) return <ConjugationExercise
            exercise={exercise}
            id={id}
            slug={slug}
            onScore={handleScoreUpdate}/>;
        if (isFillInTextExerciseWithChoices(exercise)) return <FillInTextExerciseWithChoices exercise={exercise}
                                                                                             id={id}
                                                                                             slug={slug}
                                                                                             onScore={handleScoreUpdate}/>;
        if (isFillInTextExerciseWithChoicesWithImageDecoration(exercise)) return <FillInTextExerciseWithChoicesWithImageDecoration
            exercise={exercise}
            id={id}
            slug={slug}
            onScore={handleScoreUpdate}/>;
        if (isFillInTextExerciseWithPredefinedBlocks(exercise)) return <FillInTextExerciseWithPredefinedBlocks
            exercise={exercise}
            id={id}
            slug={slug}
            onScore={handleScoreUpdate}/>;

        if (isListenExerciseWithOptionsToChoose(exercise)) return <ListenExerciseWithOptionsToChoose exercise={exercise}
                                                                                                     id={id}
                                                                                                     slug={slug}
                                                                                                     onScore={handleScoreUpdate}/>;
        if (isListenWithManyOptionsToChooseToSingleExercise(exercise)) return <ListenWithManyOptionsToChooseToSingleExercise
            exercise={exercise}
            id={id}
            slug={slug}
            onScore={handleScoreUpdate}/>;
        if (isMatchExerciseTextWithImage(exercise)) return <MatchExerciseTextWithImage exercise={exercise}
                                                                                       id={id}
                                                                                       slug={slug}
                                                                                       onScore={handleScoreUpdate}/>;
        if (isMultipleExercises(exercise)) {

          return <MultipleExercises exercise={exercise} id={id} slug={slug} onScore={handleScoreUpdate} />;
        }

        return <h1>404</h1>;
    };

    return (
        <div>
            {renderContent()}
            <div className="text-lg font-semibold mt-6">Suma punktów: {totalScore}</div>
        </div>
    );
};
export default Exercise


