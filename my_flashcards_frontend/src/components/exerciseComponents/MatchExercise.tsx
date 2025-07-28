import {MatchExerciseProps} from "../../interfaces.tsx";
import {useContext, useEffect, useState} from "react";
import {handleSendMatchExerciseAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import '../../sass/exercises/match_exercise.css';

const MatchExercise = ({exercise, id, slug, onScore}: MatchExerciseProps,) => {

    type SelectedElement = {
        left_item: string;
        right_item: string;
    };
    const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
    const [rightSelected, setRightSelected] = useState<string | null>(null);
    const [leftSelected, setLeftSelected] = useState<string | null>(null);
    const [rightItems, setRightItems] = useState<string[]>([])
    const [leftItems, setLeftItems] = useState<string[]>([])
    const {token} = useContext(AuthContext);

    useEffect(() => {
        setLeftItems(exercise.left_items);
        setRightItems(exercise.right_items);
        setSelectedElements([])
    }, [exercise]);


    const sendAnswers = async () => {
        const answers = {"answers": selectedElements}
        const path_slug = `${id}/${slug}`
        const result = await handleSendMatchExerciseAnswers(path_slug, answers, token)
        console.log("result", result)
        if (id !== undefined) {
            onScore(id.toString(), result.score, result.max_score)
        }
        console.log("send answers", answers)
    }

    // TODO BACK HERE

    const handleAddLeftItem = (item: string, key: number) => {
        console.log("leftitem", item)
        if (rightSelected != null) {
            setSelectedElements(prevState => [...prevState, {key: key, left_item: item, right_item: rightSelected}]);
            setLeftItems(prev => prev.filter(i => i !== item));
            setRightItems(prev => prev.filter(i => i !== rightSelected));

        } else {
            setLeftSelected(item)
        }

    }
    const handleAddRightItem = (item: string) => {
        console.log("rightitem", item)
        if (leftSelected != null) {
            setSelectedElements(prevState => [...prevState, {left_item: leftSelected, right_item: item}]);
            setLeftItems(prev => prev.filter(i => i !== leftSelected));
            setRightItems(prev => prev.filter(i => i !== item));
        } else {
            setRightSelected(item)
        }
    }

    const removeItem = (item: string) =>{
        console.log("selectedElements",selectedElements)
        console.log("Item", item)
    }


    return (
        <div className="matchexercise">
            <h1 className="matchexercise__title">Match Exercise</h1>
            <h3 className="matchexercise__description">{exercise.description}</h3>
            <div className="matchexercise__selectcontainer">
                <div className="matchexercise__sides">
                    <div className="matchexercise__leftside">
                        {leftItems.map((element,key) => {
                            return (
                                <button className="matchexercise__leftside__item" key={key}
                                     onClick={() => handleAddLeftItem(element)}>
                                    {element}
                                </button>
                            )
                        })}
                    </div>
                    <div className="matchexercise__rightside">
                        {rightItems.map((element) => {
                            return (
                                <button className="matchexercise__rightside__item" key={element}
                                     onClick={() => handleAddRightItem(element)}>
                                    {element}
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className="matchexercise__selectedcontainer">
                    <h1>Selected Conttainer</h1>
                    {selectedElements.map((element) => {
                        return (
                            <div className="matchexercise__selectedcontainer__item">
                                <button className="matchexercise__selectedcontainer__leftitem " onClick={()=>removeItem(element.left_item)}>
                                    {element.left_item}
                                </button>
                                <button className="matchexercise__selectedcontainer__rightitem" onClick={()=>removeItem(element.right_item)}>
                                    {element.right_item}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
            <button className="matchexercise__buttons greenoutline--button greenoutline--button--mb" onClick={sendAnswers}>
                 Send
            </button>

        </div>
    );
};

export default MatchExercise;
