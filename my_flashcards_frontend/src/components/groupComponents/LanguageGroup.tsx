import '../../sass/languagegroup.css'
import {LanguageGroupProps} from "../../interfaces.tsx";


const LanguageGroup = ({ group }: LanguageGroupProps)  => {
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

export default LanguageGroup;
