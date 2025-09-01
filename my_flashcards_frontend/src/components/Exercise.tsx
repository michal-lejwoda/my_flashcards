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
import { ExerciseProvider, useExerciseContext } from './ExerciseContext.tsx';
import "../sass/exercises/exercise.css"
import {useTranslation} from "react-i18next";

const ExerciseContent = () => {
    type ExerciseScore = {
        "score": number,
        "max_score": number,
        "id": string
    }

    const {id: idParam, slug} = useParams<{ id: string; slug: string }>();
    const id = idParam ? parseInt(idParam, 10) : undefined;
    const [exercise, setExercise] = useState<Exercises | null>(null);
    const [numberOfExercises, setNumberOfExercises] = useState<number>(1);
    const [results, setResults] = useState<ExerciseScore[]>([]);
    const [isMultipleExercise, setIsMultipleExercise] = useState(false);
    const [allChecked, setAllChecked] = useState(false);
    const { triggerCheckAll } = useExerciseContext();
    const {t} = useTranslation();

    useEffect(() => {
        if (exercise && 'exercises' in exercise && exercise.exercises.length > 0){
            setIsMultipleExercise(true)
        } else if (exercise && exercise.type) {
            setIsMultipleExercise(false)
        }
    }, [exercise]);

    const currentAudioRef = useRef<HTMLAudioElement | null>(null);

    const playSound = (src: string) => {
        console.log("src", src)
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
        }
        const newAudio = new Audio(src);
        console.log("new audio play", src)
        console.log("newAudio",newAudio)
        newAudio.play();
        currentAudioRef.current = newAudio;
    };

    const checkAllExercises = () => {
        triggerCheckAll();
        setAllChecked(true);
        setTimeout(() => {
            setAllChecked(false);
        }, 1000);
    }

    const handleScoreUpdate = useCallback((exerciseId: string, score: number, max_score: number) => {
        setResults((prev) => {
            const existingIndex = prev.findIndex(result => result.id === exerciseId);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = { id: exerciseId, score, max_score };
                return updated;
            } else {
                const newResults = [...prev, { id: exerciseId, score, max_score }];
                return newResults;
            }
        });
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

    useEffect(() => {
        setResults([]);
        setAllChecked(false);
    }, [exercise]);

    useEffect(()=>{
        if (allChecked){
        if (results.length === numberOfExercises){
            if (userScore == maxScore){
                playSound('/RightAnswer.mp3')
            }else{
                playSound('/WrongAnswer.mp3')
            }
        }}
    },[results])

    const renderContent = () => {
        if (!exercise) return null;

        const commonProps = {
            playSound,
            id,
            slug,
            onScore: handleScoreUpdate
        };

        if (isMatchExercise(exercise)) return <MatchExercise
            exercise={exercise}
            {...commonProps}
        />;
        if (isChooseExerciseDependsOnMultipleTexts(exercise)) return <ChooseExerciseDependsOnMultipleTexts
            exercise={exercise}
            {...commonProps}
        />;
        if (isChooseExerciseDependsOnSingleText(exercise)) return <ChooseExerciseDependsOnSingleText
            exercise={exercise}
            {...commonProps}
        />;
        if (isConjugationExercise(exercise)) return <ConjugationExercise
            exercise={exercise}
            {...commonProps}
        />;
        if (isFillInTextExerciseWithChoices(exercise)) return <FillInTextExerciseWithChoices
            exercise={exercise}
            {...commonProps}
        />;
        if (isFillInTextExerciseWithChoicesWithImageDecoration(exercise)) return <FillInTextExerciseWithChoicesWithImageDecoration
            exercise={exercise}
            {...commonProps}
        />;
        if (isFillInTextExerciseWithPredefinedBlocks(exercise)) return <FillInTextExerciseWithPredefinedBlocks
            exercise={exercise}
            {...commonProps}
        />;
        if (isListenExerciseWithOptionsToChoose(exercise)) return <ListenExerciseWithOptionsToChoose
            exercise={exercise}
            {...commonProps}
        />;
        if (isListenWithManyOptionsToChooseToSingleExercise(exercise)) return <ListenWithManyOptionsToChooseToSingleExercise
            exercise={exercise}
            {...commonProps}
        />;
        if (isMatchExerciseTextWithImage(exercise)) return <MatchExerciseTextWithImage
            exercise={exercise}
            {...commonProps}
        />;
        if (isMultipleExercises(exercise)) {
            return <MultipleExercises
                exercise={exercise}
                {...commonProps}
            />;
        }

        return <h1>404</h1>;
    };

    return (
        <div className="exercise__content">
            {renderContent()}
            <div className="multiple-exercises__hr"></div>

            <div className="exercise__results">
                {isMultipleExercise && (
                <button
                    onClick={checkAllExercises}
                    disabled={allChecked}
                    className={`greenoutline--button greenoutline--button--mb check-all-button ${allChecked ? 'checking' : ''}`}
                >
                    {allChecked ? t('Checking...') : t('Check all')}
                </button>
            )}
                <div className="exercise__allresults">
                    {t("Completed tasks")} {results.length} {t("out of")} {numberOfExercises}.
                    <br />
                    {t("Number of points scored")} {userScore} {t("out of")} {maxScore}
                    </div>
                {results.length === numberOfExercises && numberOfExercises > 0 && (
                    <span className="exercise__completion-status"> ✅ {t("All tasks completed")}!</span>
                )}
            </div>
        </div>
    );
};

const Exercise = () => {
    return (
        <ExerciseProvider>
            <ExerciseContent />
        </ExerciseProvider>
    );
};

export default Exercise
