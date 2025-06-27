import {useEffect, useState} from "react";
import {handleGetExercise} from "../api.tsx";
import {useParams} from "react-router-dom";
import FillInTextExerciseWithChoicesWithImageDecoration
    from "./exerciseComponents/FillInTextExerciseWithChoicesWithImageDecoration.tsx";
import FillInTextExerciseWithChoices from "./exerciseComponents/FillInTextExerciseWithChoices.tsx";
import ChooseExerciseDependsOnMultipleTexts from "./exerciseComponents/ChooseExerciseDependsOnMultipleTexts.tsx";
import ChooseExerciseDependsOnSingleText from "./exerciseComponents/ChooseExerciseDependsOnSingleText.tsx";
import ConjugationExercise from "./exerciseComponents/ConjugationExercise.tsx";
import FillInTextExerciseWithPredefinedBlocks from "./exerciseComponents/FillInTextExerciseWithPredefinedBlocks.tsx";
import FlexibleExercisePage from "./exerciseComponents/FlexibleExercisePage.tsx";
import ListenWithManyOptionsToChooseToSingleExercise
    from "./exerciseComponents/ListenWithManyOptionsToChooseToSingleExercise.tsx";
import MatchExercise from "./exerciseComponents/MatchExercise.tsx";
import MatchExerciseTextWithImage from "./exerciseComponents/MatchExerciseTextWithImage.tsx";
import MultipleExercises from "./exerciseComponents/MultipleExercises.tsx";

interface ExerciseType {
  type: string;
}


const Exercise = () => {
    const {id, slug} = useParams<{ id: string; slug: string }>();
    const [exercise, setExercise] = useState<ExerciseType | null>(null);

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
        switch (exercise.type) {
            case "ChooseExerciseDependsOnMultipleTexts":
                return <ChooseExerciseDependsOnMultipleTexts/>;
            case "ChooseExerciseDependsOnSingleText":
                return <ChooseExerciseDependsOnSingleText/>;
            case "ConjugationExercise":
                return <ConjugationExercise/>;
            case "FillInTextExerciseWithChoices":
                return <FillInTextExerciseWithChoices/>
            case "FillInTextExerciseWithChoicesWithImageDecoration":
                return <FillInTextExerciseWithChoicesWithImageDecoration/>;
            case "FillInTextExerciseWithPredefinedBlocks":
                return <FillInTextExerciseWithPredefinedBlocks/>
            case "FlexibleExercisePage":
                return <FlexibleExercisePage/>;
            case "ListenWithManyOptionsToChooseToSingleExercise":
                return <ListenWithManyOptionsToChooseToSingleExercise/>
            case "MatchExercise":
                return <MatchExercise/>;
            case "MatchExerciseTextWithImage":
                return <MatchExerciseTextWithImage/>
            case "MultipleExercises":
                return <MultipleExercises/>

            default:
                return <h1>404</h1>;
        }
    };
    return (
        <div>
            {renderContent()}
        </div>
    );
};

export default Exercise;
