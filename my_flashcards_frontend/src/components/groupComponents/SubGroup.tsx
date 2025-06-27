import '../../sass/subgroup.css'
import {SubGroupProps} from "../../interfaces.tsx";
import {useNavigate} from "react-router-dom";
const SubGroup = ({ group }: SubGroupProps)  => {
    const navigate = useNavigate();
    const handleMoveToAnotherGroup = (path_slug: string) => {
        navigate(`/exercises/${path_slug}`)
    }
    return (
        <section className="subgroup">
            <div className="subgroup__image">
                <img src="/public/languages.svg" alt=""/>
            </div>
            <div className="subgroup__container">
                <div className="subgroup__title"><h1>SubGroup</h1></div>
                <div className="subgroup__languages">
                    {group.data.children.map(child => (
                        <div onClick={() => handleMoveToAnotherGroup(child.path_slug)}
                             className="sub__container" key={child.id}>
                            {child.background_image &&  (<img   src={"http://0.0.0.0:8000" + child.background_image.url} alt=""/>)}
                            <div className="sub__title">
                                {child.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SubGroup;

