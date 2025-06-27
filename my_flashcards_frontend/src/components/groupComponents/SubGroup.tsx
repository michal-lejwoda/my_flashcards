import '../../sass/languagegroup.css'
import {SubGroupProps} from "../../interfaces.tsx";
const SubGroup = ({ group }: SubGroupProps)  => {
    console.log("props.group", group)
    return (
        <section className="languagegroup">
            <div className="languagegroup__image">
                <img src="public/languages.svg" alt=""/>
            </div>
            <div className="languagegroup__container">
                <h1>Main Group</h1>
            </div>
        </section>
    );
};

export default SubGroup;

