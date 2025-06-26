import {useEffect, useState} from "react";
import {handleGetExercise} from "../api.tsx";
import {useParams} from "react-router-dom";
import MainGroup from "./groupComponents/MainGroup.tsx";
import LanguageGroup from "./groupComponents/LanguageGroup.tsx";
import SubGroup from "./groupComponents/SubGroup.tsx";
import GroupExercises from "./groupComponents/GroupExercises.tsx";
import FillInTextExerciseWithChoicesWithImageDecoration from "./exerciseComponents/FillInTextExerciseWithChoicesWithImageDecoration.tsx";
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


const Exercise = () => {
    const {id, slug} = useParams<{ id: string; slug: string }>();
    const [exercise, setExercise] = useState(null)
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
        case "MAIN_GROUP":
            return <ChooseExerciseDependsOnMultipleTexts />;
        case "LANGUAGE_GROUP":
            return <ChooseExerciseDependsOnSingleText />;
        case "SUB_GROUP":
            return <ConjugationExercise />;
        case "GROUP_EXERCISES":
            return <FillInTextExerciseWithChoices />
        case "SUB_GROUP":
            return <FillInTextExerciseWithChoicesWithImageDecoration />;
        case "GROUP_EXERCISES":
            return <FillInTextExerciseWithPredefinedBlocks />
        case "SUB_GROUP":
            return <FlexibleExercisePage />;
        case "GROUP_EXERCISES":
            return <ListenWithManyOptionsToChooseToSingleExercise />
        case "SUB_GROUP":
            return <MatchExercise />;
        case "GROUP_EXERCISES":
            return <MatchExerciseTextWithImage />
        case "GROUP_EXERCISES":
            return <MultipleExercises />

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
