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
                <img src="/languages.svg" alt=""/>
            </div>
            <div className="subgroup__container">
                <div className="subgroup__title"><h1>{group.data.title}</h1></div>
                <div className="subgroup__containers">
                    {group.data.children.map(child => (
                        <div onClick={() => handleMoveToAnotherGroup(child.path_slug)}
                             className="sub__container" key={child.id}>
                            <div className="sub__title">
                                {child.title}
                            </div>
                            {child.background_image && (
                                <img src={`${import.meta.env.VITE_API_URL}${child.background_image.url}`} alt=""/>)}

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SubGroup;

