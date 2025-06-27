import '../../sass/subgroup.css'
import {SubGroupProps} from "../../interfaces.tsx";
const SubGroup = ({ group }: SubGroupProps)  => {
    console.log("props.group", group)
    return (
        <section className="subgroup">
            <div className="subgroup__image">
                <img src="/public/languages.svg" alt=""/>
            </div>
            <div className="subgroup__container">
                <h1>Sub Group</h1>
            </div>
        </section>
    );
};

export default SubGroup;

