import {
    LeftItemsWithImageInterface,
    MatchExerciseTextWithImageProps,
    MatchExerciseWithTextImageSelected
} from "../../interfaces.tsx";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../../context/AuthContext.tsx";
import {handleSendMatchExerciseWithImageAnswers} from "../../api.tsx";

const MatchExerciseTextWithImage = ({exercise, id, slug, onScore}: MatchExerciseTextWithImageProps) => {
    console.log("exercise", exercise)
    const [selectedElements, setSelectedElements] = useState<MatchExerciseWithTextImageSelected[]>([]);
    const [rightSelected, setRightSelected] = useState<string | null>(null);
    const [leftSelected, setLeftSelected] = useState<LeftItemsWithImageInterface | null>(null);
    const [rightItems, setRightItems] = useState<string[]>([])
    const [leftItems, setLeftItems] = useState<LeftItemsWithImageInterface[]>([])
    const {token} = useContext(AuthContext);

    useEffect(() => {
        setLeftItems(exercise.left_items);
        setRightItems(exercise.right_items);
        setSelectedElements([])
    }, [exercise]);
    console.log("leftItems", leftItems)
    console.log("rightItems", rightItems)


    const sendAnswers = async() => {
        const transformedList = selectedElements.map(item => ({
          left_item: item.left_item.id,
          right_item: item.right_item
        }));
        const answers = {"answers": transformedList}
        console.log("answers", answers)
        const path_slug = `${id}/${slug}`
        const result = await handleSendMatchExerciseWithImageAnswers(path_slug, answers, token)
        if (id !== undefined){
            onScore(id.toString(), result.score, result.max_score)
        }
        console.log("result", result)
        console.log("send answers", answers)
    }


    const handleAddLeftItem = (item: LeftItemsWithImageInterface) => {
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
            <h1>Match Exercise Text With Image</h1>
            <div className="matchexercise__selectcontainer">
                <div className="matchexercise__leftside">
                    {leftItems.map((element) => {
                        return (
                            <div className="matchexercise__leftside__item" key={element.id}
                                 onClick={() => handleAddLeftItem(element)}>
                                <img src={`${import.meta.env.VITE_API_URL}${element.url}`} alt=""/>
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

                                <img src={`${import.meta.env.VITE_API_URL}${element.left_item.url}`} alt="" />
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

export default MatchExerciseTextWithImage;
