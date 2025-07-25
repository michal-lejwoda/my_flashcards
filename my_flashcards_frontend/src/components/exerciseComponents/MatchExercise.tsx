import {MatchExerciseProps} from "../../interfaces.tsx";
import {useContext, useEffect, useState} from "react";
import {handleSendMatchExerciseAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import '../../sass/exercises/match_exercise.css';

const MatchExercise = ({exercise, id, slug, onScore}: MatchExerciseProps, ) => {

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
        const result =  await handleSendMatchExerciseAnswers(path_slug, answers, token)
        console.log("result", result)
        if (id !== undefined){
            onScore(id.toString(), result.score, result.max_score)
        }
        console.log("send answers", answers)
    }


    const handleAddLeftItem = (item: string) => {
        console.log("leftitem", item)
        if (rightSelected != null) {
            setSelectedElements(prevState => [...prevState, {left_item: item, right_item: rightSelected}]);
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


    return (
        <div>
            <h1>Match Exercise</h1>
            <div className="matchexercise__selectcontainer">
                <div className="matchexercise__leftside">
                    {leftItems.map((element) => {
                        return (
                            <div className="matchexercise__leftside__item" key={element}
                                 onClick={() => handleAddLeftItem(element)}>
                                {element}
                            </div>
                        )
                    })}
                </div>
                <div className="matchexercise__rightside">
                    {rightItems.map((element) => {
                        return (
                            <div className="matchexercise__rightside__item" key={element}
                                 onClick={() => handleAddRightItem(element)}>
                                {element}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="matchexercise__selectedcontainer">
                <h1>Selected Conttainer</h1>
                {selectedElements.map((element) => {
                    return (
                        <div className="matchexercise__selectedcontainer__item">
                            <div className="matchexercise__selectedcontainer__leftitem">
                                {element.left_item}
                            </div>
                            <div className="matchexercise__selectedcontainer__rightitem">
                                {element.right_item}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="matchexercise__buttons">
                <button onClick={sendAnswers}>Send</button>
            </div>

        </div>
    );
};

export default MatchExercise;
