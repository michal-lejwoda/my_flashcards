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
        // #TODO BACK HERE
        switch (exercise.type) {
            case "CHOOSE_EXERCISE_DEPENDS_ON_MULTIPLE_TEXTS":
                return <ChooseExerciseDependsOnMultipleTexts/>;
            case "CHOOSE_EXERCISE_DEPENDS_ON_SINGLE_TEXT":
                return <ChooseExerciseDependsOnSingleText/>;
            case "CONJUGATION_EXERCISE":
                return <ConjugationExercise/>;
            case "FILL_IN_TEXT_EXERCISE_WITH_CHOICES":
                return <FillInTextExerciseWithChoices/>
            case "FILL_IN_TEXT_EXERCISE_WITH_CHOICES_WITH_IMAGE_DECORATION":
                return <FillInTextExerciseWithChoicesWithImageDecoration/>;
            case "FILL_IN_TEXT_EXERCISE_WITH_PREDEFINED_BLOCKS":
                return <FillInTextExerciseWithPredefinedBlocks/>
            case "FLEXIBLE_EXERCISE_PAGE":
                return <FlexibleExercisePage/>;
            case "LISTEN_WITH_MANY_OPTIONS_TO_CHOOSE_TO_SINGLE_EXERCISE":
                return <ListenWithManyOptionsToChooseToSingleExercise/>
            case "MATCH_EXERCISE":
                return <MatchExercise/>;
            case "MATCH_EXERCISE_TEXT_WITH_IMAGE":
                return <MatchExerciseTextWithImage/>
            case "MULTIPLE_EXERCISES":
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
