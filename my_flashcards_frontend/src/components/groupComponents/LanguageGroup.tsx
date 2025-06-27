import '../../sass/languagegroup.css'
import {LanguageGroupProps} from "../../interfaces.tsx";


const LanguageGroup = ({ group }: LanguageGroupProps)  => {
    console.log("props.group", group)
    return (
        <section className="languagegroup">
            <div className="languagegroup__image">
                <img src="/public/languages.svg" alt=""/>
            </div>
            <div className="languagegroup__container">
                <div className="languagegroup__title"><h1>LanguageGroup</h1></div>
                <div className="languagegroup__languages">
                    {group.data.map(language => (
                        <div className="languages__container" key={language.id}>
                            <img src={"http://0.0.0.0:8000" + language.flag_image.url} alt=""/>
                            <div className="languages__title">
                                {language.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LanguageGroup;
