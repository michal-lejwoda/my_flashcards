import '../../sass/groupexercises.css'
import {GroupExercisesProps} from "../../interfaces.tsx";
import {useNavigate} from "react-router-dom";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";

const GroupExercises = ({group}: GroupExercisesProps) => {
    const [openGroupIds, setOpenGroupIds] = useState<number[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
    if (group?.data?.children) {
        const allIds = group.data.children.map(child => child.id);
        setOpenGroupIds(allIds);
    }
}, [group.data.children]);

    const toggleGroup = (id: number) => {
        setOpenGroupIds(prev =>
            prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
        );
    };

    const handleGoToExercise = (url: string) => {
        navigate(`/exercise/${url}`);
    };

    return (
        <section className="groupexercises">
            <div className="groupexercises__image">
                <img src="/languages.svg" alt=""/>
            </div>
            <div className="groupexercises__container">
                <div className="groupexercises__title"><h1>{group.data.title}</h1></div>
                <div className="groupexercises__items">
                    {group.data.children.map(child => {
                        const isOpen = openGroupIds.includes(child.id);
                        return (
                            <div className="grp__container" key={child.id}>
                                <div className="grp__level__container">
                                    {child.background_image && (
                                        <img src={import.meta.env.VITE_API_URL + child.background_image.url} alt=""/>
                                    )}
                                    <div className="grp__title" onClick={() => toggleGroup(child.id)}>
                                        <div className="grp__title__name">
                                            {child.title}
                                        </div>
                                        <div className="grp__title__icon">
                                            <FontAwesomeIcon
                                                size="1x"
                                                icon={faChevronDown}
                                                className={isOpen ? "rotate" : ""}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="grp__exercise__container">
                                        {child.children.map(exercise => (
                                            <div
                                                className="grp__exercise__item"
                                                onClick={() => handleGoToExercise(exercise.url)}
                                                key={exercise.id}
                                            >
                                                {exercise.title}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
export default GroupExercises
