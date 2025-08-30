import {MatchExerciseAnswerResponse, MatchExerciseProps} from "../../interfaces.tsx";
import {useContext, useEffect, useState} from "react";
import {handleSendMatchExerciseAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import '../../sass/exercises/match_exercise.css';
import {useExerciseContext} from "../ExerciseContext.tsx";
import {useTranslation} from "react-i18next";

const MatchExercise = ({playSound,  exercise, id, slug, onScore}: MatchExerciseProps) => {

    type SelectedElement = {
        left_item: string;
        right_item: string;
    };
    const [activeLeftIndex, setActiveLeftIndex] = useState<number | null>(null);
    const [activeRightIndex, setActiveRightIndex] = useState<number | null>(null);
    const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
    const [rightSelected, setRightSelected] = useState<string | null>(null);
    const [leftSelected, setLeftSelected] = useState<string | null>(null);
    const [rightItems, setRightItems] = useState<string[]>([])
    const [leftItems, setLeftItems] = useState<string[]>([])
    const [disableButton, setDisableButton] = useState<boolean>(false)
    const [results, setResults] = useState<MatchExerciseAnswerResponse | undefined>()
    const [resultMode, setResultMode] = useState<boolean>(false)
    const {token} = useContext(AuthContext);
    const { shouldCheckAll, resetCheckAll } = useExerciseContext();
    const {t} = useTranslation();

    useEffect(() => {
        if (shouldCheckAll && !resultMode && !disableButton) {
            sendAnswers();
            resetCheckAll();
        }
    }, [shouldCheckAll, resultMode, disableButton]);

    useEffect(() => {
        setLeftItems(exercise.left_items);
        setRightItems(exercise.right_items);
        setSelectedElements([])
    }, [exercise]);




    const sendAnswers = async () => {
        if (disableButton || resultMode) return;
        const answers = {"answers": selectedElements}
        const path_slug = `${id}/${slug}`
        const result = await handleSendMatchExerciseAnswers(path_slug, answers, token)
        if (id !== undefined) {
            onScore(id.toString(), result.score, result.max_score)
        }
        setDisableButton(true)
        setResults(result)
        setResultMode(true)
        if (result.score == result.max_score){
            playSound('/RightAnswer.mp3')
        }else{
            playSound('/WrongAnswer.mp3')
        }
    }


    const handleAddLeftItem = (item: string, key: number) => {
        if (rightSelected != null) {
            setSelectedElements(prevState => [...prevState, {left_item: item, right_item: rightSelected}]);
            setLeftItems(prev => prev.filter(i => i !== item));
            setRightItems(prev => prev.filter(i => i !== rightSelected));
            setLeftSelected(null)
            setRightSelected(null)
            setActiveLeftIndex(null)
            setActiveRightIndex(null)

        } else {
            setLeftSelected(item)
            setActiveLeftIndex(key)
        }
    }



    const handleAddRightItem = (item: string, key: number) => {
        if (leftSelected != null) {
            setSelectedElements(prevState => [...prevState, {left_item: leftSelected, right_item: item}]);
            setLeftItems(prev => prev.filter(i => i !== leftSelected));
            setRightItems(prev => prev.filter(i => i !== item));
            setLeftSelected(null)
            setRightSelected(null)
            setActiveLeftIndex(null)
            setActiveRightIndex(null)
        } else {
            setRightSelected(item)
            setActiveRightIndex(key)
        }
    }

    const removeItem = (indexToRemove: number) => {
    setSelectedElements(prev => {
        const removed = prev[indexToRemove];
        setLeftItems(items => [...items, removed.left_item]);
        setRightItems(items => [...items, removed.right_item]);
        setLeftSelected(null)
        setRightSelected(null)
        setActiveLeftIndex(null)
        setActiveRightIndex(null)
        return prev.filter((_, index) => index !== indexToRemove);

    });
};



    return (
        <div className="matchexercise">
            <div className="matchexercise__selectcontainer">
                <div className="matchexercise__description">{t(exercise.description)}</div>
                <div className="matchexercise__sides">
                    <div className="matchexercise__leftside">
    {leftItems.map((element,key) => {
        return (
            <button
                className={`matchexercise__leftside__item ${activeLeftIndex === key ? 'matchexercise__item__active' : ''}`}
                 onClick={() => handleAddLeftItem(element, key)}>
                {element}
            </button>
        )
    })}
</div>
<div className="matchexercise__rightside">
    {rightItems.map((element,key) => {
        return (
            <button
             className={`matchexercise__rightside__item ${activeRightIndex === key ? 'matchexercise__item__active' : ''}`}
             onClick={() => handleAddRightItem(element, key)}>
            {element}
        </button>
        )
    })}
</div>
                </div>
                <div className="matchexercise__selectedcontainer">
    <h3>{t("Created pairs")}</h3>
    {selectedElements.map((element, key) => {
        const isCorrect = resultMode && results?.result_answers?.some(result =>
            result.left_item === element.left_item &&
            result.right_item === element.right_item &&
            result.correct
        );
        const isIncorrect = resultMode && results?.result_answers?.some(result =>
            result.left_item === element.left_item &&
            result.right_item === element.right_item &&
            !result.correct
        );


        return (
            <div key={key} className="matchexercise__selectedcontainer__item">
                <button
                    className={`matchexercise__selectedcontainer__leftitem ${
                        isCorrect ? 'matchexercise__selectedcontainer__leftitem--correct' :
                        isIncorrect ? 'matchexercise__selectedcontainer__leftitem--incorrect' : ''
                    }`}
                    onClick={() => !resultMode && removeItem(key)}
                    disabled={resultMode}
                >
                    {element.left_item}
                </button>
                <button
                    className={`matchexercise__selectedcontainer__rightitem ${
                        isCorrect ? 'matchexercise__selectedcontainer__rightitem--correct' :
                        isIncorrect ? 'matchexercise__selectedcontainer__rightitem--incorrect' : ''
                    }`}
                    onClick={() => !resultMode && removeItem(key)}
                    disabled={resultMode}
                >
                    {element.right_item}
                </button>
            </div>
        )
    })}
</div>
            </div>
            <button disabled={disableButton} className="matchexercise__buttons greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>
                 {resultMode ? t('Checked') : t('Check')}
            </button>

        </div>
    );
};

export default MatchExercise;
