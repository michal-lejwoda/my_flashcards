import '../../sass/groupexercises.css'
import {GroupExercisesProps} from "../../interfaces.tsx";
import {useNavigate} from "react-router-dom";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const GroupExercises = ({group}: GroupExercisesProps) => {
    console.log("props.group", group)
    const navigate = useNavigate();
    // const handleMoveToAnotherGroup = (path_slug: string) => {
    //     navigate(`/exercises/${path_slug}`)
    // }

    const handleGoToExercise = (url: string) => {
        navigate(`/exercise/${url}`);
    }
    // #TODO BACK HERE

    return (
        <section className="groupexercises">
            <div className="groupexercises__image">
                <img src="/public/languages.svg" alt=""/>
            </div>
            <div className="groupexercises__container">
                <div className="groupexercises__title"><h1>{group.data.title}</h1>

                </div>
                <div className="groupexercises__items">
                    {group.data.children.map(child => (
                        <div className="grp__container" key={child.id}>
                            <div className="grp__level__container">
                                {child.background_image && (
                                    <img src={"http://0.0.0.0:8000" + child.background_image.url} alt=""/>)}
                                <div className="grp__title">
                                    <div className="grp__title__name">
                                        {child.title}
                                    </div>
                                    <div className="grp__title__icon">
                                        <FontAwesomeIcon size="1x" icon={faChevronDown}/>
                                    </div>
                                </div>
                            </div>
                            <div className="grp__exercise__container">
                                {child.children.map(exercise => (
                                    <div className="grp__exercise__item"
                                         onClick={() => handleGoToExercise(exercise.url)}>
                                        {exercise.title}
                                    </div>
                                ))}
                            </div>


                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GroupExercises;

