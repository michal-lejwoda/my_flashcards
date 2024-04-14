import withAuth from "../context/withAuth.tsx";
import {useTranslation} from "react-i18next";
import SearchTable from "../table/SearchTable.tsx";

const Search = () => {
    const {t} = useTranslation();
    const handleSearch = (search_word: string) => {
        if (search_word.length > 2) {
            console.log("search_word")
            console.log(search_word)
        }
    }

    return (
        <div className="search">
            <h1>Search</h1>
            <input onChange={(e) => handleSearch(e.target.value)} type="text"/>
            <button>{t("search")}</button>
            <SearchTable />
        </div>
    );
};

export default withAuth(Search);
