import '../../sass/languagegroup.css'
import {GroupExercisesProps} from "../../interfaces.tsx";
const GroupExercises = ({ group }: GroupExercisesProps)  => {
    console.log("props.group", group)
    return (
        <section className="languagegroup">
            <div className="languagegroup__image">
                <img src="public/languages.svg" alt=""/>
            </div>
            <div className="languagegroup__container">
                <h1>LanguageGroup</h1>
            </div>
        </section>
    );
};

export default GroupExercises;

