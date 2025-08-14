import '../../sass/maingroup.css'
import {MainGroupProps} from "../../interfaces.tsx";
import {useNavigate} from "react-router-dom";

const MainGroup = ({group}: MainGroupProps) => {
    const navigate = useNavigate();
    const handleMoveToAnotherGroup = (path_slug: string) => {
        navigate(`/exercises/${path_slug}`)
    }
    return (
        <section className="maingroup">
            <div className="maingroup__image">
                <img src="/languages.svg" alt=""/>
            </div>
            <div className="maingroup__container">
                <div className="maingroup__title"><h1>{group.data.title}</h1></div>
                <div className="maingroup__containers">
                    {group.data.children.map(child => (
                        <div onClick={() => handleMoveToAnotherGroup(child.path_slug)}
                             className="main__container" key={child.id}>
                            <div className="main__title">
                                {child.title}
                            </div>
                            {child.background_image && (
                                <img src={`${import.meta.env.VITE_API_URL}${child.background_image.url}`} alt=""/>)}
                            <div className="main__description">
                                {child.main_description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default MainGroup;
