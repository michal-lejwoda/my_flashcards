import {
    LeftItemsWithImageInterface,
    MatchExerciseTextWithImageProps,
    MatchExerciseWithTextImageSelected
} from "../../interfaces.tsx";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../../context/AuthContext.tsx";
import {handleSendMatchExerciseWithImageAnswers} from "../../api.tsx";
import "../../sass/exercises/match_exercise_text_with_image.css"


const MatchExerciseTextWithImage = ({exercise, id, slug, onScore}: MatchExerciseTextWithImageProps) => {
    console.log("exercise", exercise)
    const [selectedElements, setSelectedElements] = useState<MatchExerciseWithTextImageSelected[]>([]);
    const [rightSelected, setRightSelected] = useState<string | null>(null);
    const [leftSelected, setLeftSelected] = useState<LeftItemsWithImageInterface | null>(null);
    const [rightItems, setRightItems] = useState<string[]>([])
    const [leftItems, setLeftItems] = useState<LeftItemsWithImageInterface[]>([])
    const {token} = useContext(AuthContext);
    const [activeLeftIndex, setActiveLeftIndex] = useState<number | null>(null);
    const [activeRightIndex, setActiveRightIndex] = useState<number | null>(null);

    useEffect(() => {
        setLeftItems(exercise.left_items);
        setRightItems(exercise.right_items);
        setSelectedElements([])
    }, [exercise]);
    console.log("leftItems", leftItems)
    console.log("rightItems", rightItems)


    const sendAnswers = async () => {
        const transformedList = selectedElements.map(item => ({
            left_item: item.left_item.id,
            right_item: item.right_item
        }));
        const answers = {"answers": transformedList}
        console.log("answers", answers)
        const path_slug = `${id}/${slug}`
        const result = await handleSendMatchExerciseWithImageAnswers(path_slug, answers, token)
        if (id !== undefined) {
            onScore(id.toString(), result.score, result.max_score)
        }
        console.log("result", result)
        console.log("send answers", answers)
    }


    const handleAddLeftItem = (item: LeftItemsWithImageInterface, key: number) => {
        console.log("leftitem", item)
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
        console.log("rightitem", item)
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
            <h1 className="matchexercise__title">Match Exercise Text With Image</h1>
            <div className="matchexercise__selectcontainer">
                <div className="matchexercise__description">{exercise.description}</div>
                <div className="matchexercise__sides">
                    <div className="matchexercise__leftside">
                        {rightItems.map((element, key) => {
                            return (
                                <button
                                    className={`matchexercise__leftside__item ${activeRightIndex === key ? 'matchexercise__item__active' : ''}`}
                                    onClick={() => handleAddRightItem(element, key)}>
                                    {element}
                                </button>
                            )
                        })}
                    </div>
                    <div className="matchexercise__rightside">
                        {leftItems.map((element, key) => {
                            return (
                                <button
                                    className={`matchexercise__rightside__item ${activeLeftIndex === key ? 'matchexercise__item__active' : ''}`}
                                    onClick={() => handleAddLeftItem(element, key)}>
                                    <img src={`${import.meta.env.VITE_API_URL}${element.url}`} alt=""/>
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className="matchexercise__selectedcontainer">
                    <h1>Selected Container</h1>
                    <div className="matchexercise__selectedcontainer__items">
                        {selectedElements.map((element, key) => {
                            return (
                                <div className="matchexercise__selectedcontainer__item">
                                    <div className="matchexercise__selectedcontainer__leftitem"
                                         onClick={() => removeItem(key)}>
                                        {element.right_item}
                                    </div>
                                    <div className="matchexercise__selectedcontainer__rightitem"
                                         onClick={() => removeItem(key)}>
                                        <img src={`${import.meta.env.VITE_API_URL}${element.left_item.url}`} alt=""/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <button className="matchexercise__buttons greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>
                 Check
            </button>

        </div>
    );
};

export default MatchExerciseTextWithImage;
