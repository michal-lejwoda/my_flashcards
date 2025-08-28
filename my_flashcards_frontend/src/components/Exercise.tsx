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
    isMultipleExercises
} from "../interfaces.tsx";
import MatchExercise from "./exerciseComponents/MatchExercise.tsx";
import {useParams} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
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
import "../../src/sass/exercises/exercise.css"

const Exercise = () => {
    type ExerciseScore = {
        "score": number,
        "max_score": number
    }
    const {id: idParam, slug} = useParams<{ id: string; slug: string }>();
    const id = idParam ? parseInt(idParam, 10) : undefined;
    const [exercise, setExercise] = useState<Exercises | null>(null);
    const [numberOfExercises, setNumberOfExercises] = useState<number>(1);
    const [results, setResults] = useState<ExerciseScore[]>([]);

    const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = (src: string) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    console.log(src)
    const newAudio = new Audio(src);
    console.log(newAudio)
    newAudio.play();
    currentAudioRef.current = newAudio;
  };



    const handleScoreUpdate = useCallback((exerciseId: string, score: number, max_score: number) => {
        setResults((prev) => [
            ...prev,
            {id: exerciseId, score, max_score}
        ]);
    }, []);

    const userScore = results.reduce((acc, v) => acc + v.score, 0)
    const maxScore = results.reduce((acc, v) => acc + v.max_score, 0)

    useEffect(() => {
        const fetchExercise = async () => {
            const res = await handleGetExercise(id, slug);
            setExercise(res);
            if (res.type !== "MultipleExercises") {
                setNumberOfExercises(1)
            } else {
                setNumberOfExercises(res.exercises.length)
            }
        };
        fetchExercise();
    }, [id, slug]);

    const renderContent = () => {
        if (!exercise) return null;


        if (isMatchExercise(exercise)) return <MatchExercise
            playSound={playSound}
            exercise={exercise}
                                                             id={id}
                                                             slug={slug}
                                                             onScore={handleScoreUpdate}
        />;
        if (isChooseExerciseDependsOnMultipleTexts(exercise)) return <ChooseExerciseDependsOnMultipleTexts
            playSound={playSound}
            exercise={exercise}
            id={id}
            slug={slug}
            onScore={handleScoreUpdate}/>;
        if (isChooseExerciseDependsOnSingleText(exercise)) return <ChooseExerciseDependsOnSingleText
            playSound={playSound}
            exercise={exercise}
            id={id}
            slug={slug}
            onScore={handleScoreUpdate}
        />;
        if (isConjugationExercise(exercise)) return <ConjugationExercise
            playSound={playSound}
            exercise={exercise}
            id={id}
            slug={slug}
            onScore={handleScoreUpdate}/>;
        if (isFillInTextExerciseWithChoices(exercise)) return <FillInTextExerciseWithChoices
            playSound={playSound}
            exercise={exercise}
                                                                                             id={id}
                                                                                             slug={slug}
                                                                                             onScore={handleScoreUpdate}/>;
        if (isFillInTextExerciseWithChoicesWithImageDecoration(exercise)) return <FillInTextExerciseWithChoicesWithImageDecoration
            playSound={playSound}
            exercise={exercise}
            id={id}
            slug={slug}
            onScore={handleScoreUpdate}/>;
        if (isFillInTextExerciseWithPredefinedBlocks(exercise)) return <FillInTextExerciseWithPredefinedBlocks
            playSound={playSound}
            exercise={exercise}
            id={id}
            slug={slug}
            onScore={handleScoreUpdate}/>;

        if (isListenExerciseWithOptionsToChoose(exercise)) return <ListenExerciseWithOptionsToChoose
            playSound={playSound}
            exercise={exercise}
            id={id}
            slug={slug}
            onScore={handleScoreUpdate}/>;

        if (isListenWithManyOptionsToChooseToSingleExercise(exercise)) return <ListenWithManyOptionsToChooseToSingleExercise
            playSound={playSound}
            exercise={exercise}
            id={id}
            slug={slug}
            onScore={handleScoreUpdate}/>;
        if (isMatchExerciseTextWithImage(exercise)) return <MatchExerciseTextWithImage
            playSound={playSound}
            exercise={exercise}
                                                                                       id={id}
                                                                                       slug={slug}
                                                                                       onScore={handleScoreUpdate}/>;
        if (isMultipleExercises(exercise)) {
            return <MultipleExercises
                playSound={playSound}
                exercise={exercise} id={id} slug={slug}
                                      onScore={handleScoreUpdate}
            />;
        }

        return <h1>404</h1>;
    };

    return (
        <div className="exercise__content">
            {renderContent()}
            <div className="exercise__results">Zrobione zadania {results.length} z {numberOfExercises}. Liczba punktow {userScore} z {maxScore}</div>
        </div>
    );
};
export default Exercise


