import '../../sass/groupexercises.css'
import {GroupExercisesProps} from "../../interfaces.tsx";
const GroupExercises = ({ group }: GroupExercisesProps)  => {
    console.log("props.group", group)
    return (
        <section className="groupexercises">
            <div className="groupexercises__image">
                <img src="public/languages.svg" alt=""/>
            </div>
            <div className="groupexercises__container">
                <h1>LanguageGroup</h1>
            </div>
        </section>
    );
};

export default GroupExercises;

