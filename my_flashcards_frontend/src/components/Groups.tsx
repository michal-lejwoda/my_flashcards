import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {handleGetGroups, handleGetLanguages} from "../api.tsx";
import MainGroup from "./groupComponents/MainGroup.tsx";
import LanguageGroup from "./groupComponents/LanguageGroup.tsx";
import SubGroup from "./groupComponents/SubGroup.tsx";
import GroupExercises from "./groupComponents/GroupExercises.tsx";
import {Group, isGroupExercises, isLanguageGroup, isMainGroup, isSubGroup} from "../interfaces.tsx";


const Groups = () => {
    const [group, setGroup] = useState<Group | null>(null);
    const location = useLocation();

    useEffect(() => {
        const fetchLanguages = async () => {
            const result = await handleGetLanguages();
            setGroup(result)
        };
        const fetchGroups = async (slug: string) => {
            const result = await handleGetGroups(slug)
            setGroup(result)
        }
        const fullPath = location.pathname;
        const subPath = fullPath.replace(/^\/exercises\/?/, '');
        if (subPath === "") {
            fetchLanguages();
        } else {
            fetchGroups(subPath);
        }
    }, [location.pathname]);

    const renderContent = () => {
        if (!group || !group.children) return null;

        if (isMainGroup(group)) {
            return <MainGroup group={group}/>;
        }

        if (isLanguageGroup(group)) {
            return <LanguageGroup group={group}/>;
        }

        if (isSubGroup(group)) {
            return <SubGroup group={group}/>;
        }

        if (isGroupExercises(group)) {
            return <GroupExercises group={group}/>;
        }

        return <h1>404</h1>;
    };


    return (
        <div>
            {/*{group && group.children && <h1>{group.children}</h1>}*/}
            {group && group.children && renderContent()}
        </div>
    );
};


export default Groups;
