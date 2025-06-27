import '../../sass/groupexercises.css'
import {GroupExercisesProps} from "../../interfaces.tsx";
import {useNavigate} from "react-router-dom";
const GroupExercises = ({ group }: GroupExercisesProps)  => {
    console.log("props.group", group)
    const navigate = useNavigate();
    const handleMoveToAnotherGroup = (path_slug: string) => {
        navigate(`/exercises/${path_slug}`)
    }
    return (
        <section className="groupexercises">
            <div className="groupexercises__image">
                <img src="/public/languages.svg" alt=""/>
            </div>
            <div className="groupexercises__container">
                <div className="groupexercises__title"><h1>Group Exercise</h1></div>
                <div className="groupexercises__languages">
                    {group.data.children.map(child => (
                        <div onClick={() => handleMoveToAnotherGroup(child.path_slug)}
                             className="grp__container" key={child.id}>
                            {child.background_image &&  (<img   src={"http://0.0.0.0:8000" + child.background_image.url} alt=""/>)}
                            <div className="grp__title">
                                {child.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GroupExercises;

