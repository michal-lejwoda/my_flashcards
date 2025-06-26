import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {handleGetGroups, handleGetLanguages} from "../api.tsx";
import MainGroup from "./groupComponents/MainGroup.tsx";
import LanguageGroup from "./groupComponents/LanguageGroup.tsx";
import SubGroup from "./groupComponents/SubGroup.tsx";
import GroupExercises from "./groupComponents/GroupExercises.tsx";

type Group = {
  children?: string;
  data: {
    title: string;
    children: unknown[];
  };
};

const Exercises = () => {
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
    }, []);

    const renderContent = () => {
    if (!group || !group.children) return null;

    switch (group.children) {
        case "MAIN_GROUP":
            return <MainGroup />;
        case "LANGUAGE_GROUP":
            return <LanguageGroup />;
        case "SUB_GROUP":
            return <SubGroup />;
        case "GROUP_EXERCISES":
            return <GroupExercises />
        default:
            return <h1>404</h1>;
    }
};


    return (
        <div>
            {/*{group && group.children && <h1>{group.children}</h1>}*/}
            {renderContent()}
        </div>
    );
};


export default Exercises;
