import '../../sass/languagegroup.css'
import {LanguageGroupProps} from "../../interfaces.tsx";
import {useNavigate} from "react-router-dom";
import {t} from "i18next";


const LanguageGroup = ({ group }: LanguageGroupProps)  => {
    console.log("props.group", group)
    const navigate = useNavigate();
    const handleMoveToAnotherGroup = (path_slug: string) => {
        navigate(`/exercises/${path_slug}`)
    }
    return (
        <section className="languagegroup">
            <div className="languagegroup__image">
                <img src="/languages.svg" alt=""/>
            </div>
            <div className="languagegroup__container">
                <div className="languagegroup__title"><h1>{t("Choose Language")}</h1></div>
                <div className="languagegroup__languages">
                    {group.data.map(language => (
                        <div onClick={()=>handleMoveToAnotherGroup(language.path_slug)} className="languages__container" key={language.id}>
                            <img src={`${import.meta.env.VITE_API_URL}${language.flag_image.url}`} alt="" />
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
