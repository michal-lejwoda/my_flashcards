import {MatchExerciseProps} from "../../interfaces.tsx";
import {useContext, useEffect, useState} from "react";
import {handleSendMatchExerciseAnswers} from "../../api.tsx";
import AuthContext from "../../context/AuthContext.tsx";

const MatchExercise = ({exercise,id,slug}: MatchExerciseProps) => {
    console.log("exercise", exercise)
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
    }, [exercise]);
    console.log("leftItems", leftItems)

    const sendAnswers = () => {
        const answers = {"answers": selectedElements}
        const path_slug = `${id}/${slug}`
        console.log("answers", answers)
        handleSendMatchExerciseAnswers(path_slug, answers, token)
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
                            <div className="matchexercise__leftside__item" key={element} onClick={() => handleAddLeftItem(element)}>
                                {element}
                            </div>
                        )
                    })}
                </div>
                <div className="matchexercise__rightside">
                    {rightItems.map((element) => {
                        return (
                            <div className="matchexercise__rightside__item" key={element} onClick={() => handleAddRightItem(element)}>
                                {element}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="matchexercise__selectedcontainer">

            </div>
            <div className="matchexercise__buttons">
                <button onClick={sendAnswers}>Send</button>
            </div>
        </div>
    );
};

export default MatchExercise;
