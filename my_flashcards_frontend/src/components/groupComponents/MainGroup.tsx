import '../../sass/maingroup.css'
import {MainGroupProps} from "../../interfaces.tsx";
const MainGroup = ({ group }: MainGroupProps)  => {
    console.log("props.group", group)
    return (
        <section className="maingroup">
            <div className="maingroup__image">
                <img src="public/languages.svg" alt=""/>
            </div>
            <div className="maingroup__container">
                <h1>Main Group</h1>
            </div>
        </section>
    );
};

export default MainGroup;
