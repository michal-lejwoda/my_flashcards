import {useEffect, useState} from "react";
import {handleGetExercise} from "../api.tsx";
import {useParams} from "react-router-dom";
import {
    Exercises,
    isChooseExerciseDependsOnMultipleTexts,
    isChooseExerciseDependsOnSingleText,
    isConjugationExercise,
    isFillInTextExerciseWithChoices,
    isFillInTextExerciseWithChoicesWithImageDecoration,
    isFillInTextExerciseWithPredefinedBlocks,
    isFlexibleExercisePage,
    isListenWithManyOptionsToChooseToSingleExercise,
    isMatchExercise,
    isMatchExerciseTextWithImage,
    isMultipleExercises
} from "../interfaces.tsx";
import MatchExercise from "./exerciseComponents/MatchExercise.tsx";
import ChooseExerciseDependsOnMultipleTexts from "./exerciseComponents/ChooseExerciseDependsOnMultipleTexts.tsx";
import ChooseExerciseDependsOnSingleText from "./exerciseComponents/ChooseExerciseDependsOnSingleText.tsx";
import ConjugationExercise from "./exerciseComponents/ConjugationExercise.tsx";
import FillInTextExerciseWithChoices from "./exerciseComponents/FillInTextExerciseWithChoices.tsx";
import FillInTextExerciseWithChoicesWithImageDecoration
    from "./exerciseComponents/FillInTextExerciseWithChoicesWithImageDecoration.tsx";
import FillInTextExerciseWithPredefinedBlocks from "./exerciseComponents/FillInTextExerciseWithPredefinedBlocks.tsx";
import FlexibleExercisePage from "./exerciseComponents/FlexibleExercisePage.tsx";
import ListenWithManyOptionsToChooseToSingleExercise
    from "./exerciseComponents/ListenWithManyOptionsToChooseToSingleExercise.tsx";
import MatchExerciseTextWithImage from "./exerciseComponents/MatchExerciseTextWithImage.tsx";
import MultipleExercises from "./exerciseComponents/MultipleExercises.tsx";


const Exercise = () => {
    const {id, slug} = useParams<{ id: string; slug: string }>();
    const [exercise, setExercise] = useState<Exercises | null>(null);

    console.log("location", location)
    useEffect(() => {
        const fetchExercise = async () => {
            const result = await handleGetExercise(id, slug);
            setExercise(result)
        };
        fetchExercise()

    }, []);
    console.log("exercise", exercise)
    console.log(location)
    const renderContent = () => {
        if (!exercise || !exercise.type) return null;

        if (isMatchExercise(exercise)) {
            return <MatchExercise exercise={exercise} id={id} slug={slug}/>;
        }

        if (isChooseExerciseDependsOnMultipleTexts(exercise)) {
            return <ChooseExerciseDependsOnMultipleTexts exercise={exercise}  id={id} slug={slug}/>;
        }
        if (isChooseExerciseDependsOnSingleText(exercise)) {
            return <ChooseExerciseDependsOnSingleText exercise={exercise} id={id} slug={slug}/>;
        }
        if (isConjugationExercise(exercise)) {
            return <ConjugationExercise exercise={exercise} id={id} slug={slug}/>;
        }
        if (isFillInTextExerciseWithChoices(exercise)) {
            return <FillInTextExerciseWithChoices exercise={exercise} id={id} slug={slug}/>;
        }
        if (isFillInTextExerciseWithChoicesWithImageDecoration(exercise)) {
            return <FillInTextExerciseWithChoicesWithImageDecoration exercise={exercise} id={id} slug={slug}/>;
        }
        if (isFillInTextExerciseWithPredefinedBlocks(exercise)) {
            return <FillInTextExerciseWithPredefinedBlocks exercise={exercise} id={id} slug={slug}/>;
        }
        if (isFlexibleExercisePage(exercise)) {
            return <FlexibleExercisePage exercise={exercise}/>;
        }
        if (isListenWithManyOptionsToChooseToSingleExercise(exercise)) {
            return <ListenWithManyOptionsToChooseToSingleExercise exercise={exercise}/>;
        }
        if (isMatchExerciseTextWithImage(exercise)) {
            return <MatchExerciseTextWithImage exercise={exercise} id={id} slug={slug}/>;
        }
        if (isMultipleExercises(exercise)) {
            return <MultipleExercises exercise={exercise}/>;
        }


        return <h1>404</h1>;
    };
    // const renderContent = () => {
    //     if (!exercise || !exercise.type) return null;
    //     switch (exercise.type) {
    //         case "ChooseExerciseDependsOnMultipleTexts":
    //             return <ChooseExerciseDependsOnMultipleTexts exercise={exercise}/>;
    //         case "ChooseExerciseDependsOnSingleText":
    //             return <ChooseExerciseDependsOnSingleText/>;
    //         case "ConjugationExercise":
    //             return <ConjugationExercise/>;
    //         case "FillInTextExerciseWithChoices":
    //             return <FillInTextExerciseWithChoices/>
    //         case "FillInTextExerciseWithChoicesWithImageDecoration":
    //             return <FillInTextExerciseWithChoicesWithImageDecoration/>;
    //         case "FillInTextExerciseWithPredefinedBlocks":
    //             return <FillInTextExerciseWithPredefinedBlocks/>
    //         case "FlexibleExercisePage":
    //             return <FlexibleExercisePage/>;
    //         case "ListenWithManyOptionsToChooseToSingleExercise":
    //             return <ListenWithManyOptionsToChooseToSingleExercise/>
    //         case "MatchExercise":
    //             return <MatchExercise/>;
    //         case "MatchExerciseTextWithImage":
    //             return <MatchExerciseTextWithImage/>
    //         case "MultipleExercises":
    //             return <MultipleExercises/>
    //
    //         default:
    //             return <h1>404</h1>;
    //     }
    // };
    return (
        <div>
            {renderContent()}
        </div>
    );
};

export default Exercise;
