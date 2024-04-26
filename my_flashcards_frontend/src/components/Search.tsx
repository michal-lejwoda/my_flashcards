import SearchTable from "../table/SearchTable.tsx";
import {useContext, useEffect, useState} from "react";
import {searchWordWithDeck} from "../api.tsx";
import AuthContext from "../context/AuthContext.tsx";
import {ErrorResponse, SearchWordsResponseTable} from "../interfaces.tsx";
import withAuth from "../context/withAuth.tsx";
import EditModal from "../modals/EditModal.tsx";
import {useTranslation} from "react-i18next";
import CenteredTitle from "./elements/CenteredTitle.tsx";
import MainSearchField from "./elements/MainSearchField.tsx";
import '../sass/search.css'

const Search = () => {
    const [searchWord, setSearchWord] = useState("")
    const {token} = useContext(AuthContext);
    const {t} = useTranslation();
    const [data, setData] = useState<SearchWordsResponseTable | null>(null)
    const [pageSize, setPageSize] = useState(10)
    const [editId, setEditIt] = useState<number | null>(null)
    const [showEdit, setShowEdit] = useState(false)
    const handleOpenEditModal = (id: number) => {
        setEditIt(id)
        setShowEdit(true)
    }


    const handleSearchWithDeck = async () => {
        try {
            const response = await searchWordWithDeck(searchWord, token, pageSize)
            setData(response)
        } catch (err: unknown) {
            const error = err as ErrorResponse
            console.log("error")
            console.log(error)
        }
    }
    useEffect(() => {
        handleSearchWithDeck()
    }, [searchWord, pageSize])

    return (
        <div className="search">
            <div className="search__header">
                <CenteredTitle title={t("search")}/>
                <MainSearchField
                    label={t("search_words")}
                    name="search"
                    type="text"
                    onChange={(e) => setSearchWord(e.target.value)}
                />
            </div>
            <div className="search__body">
                {data && data.results &&
                    <SearchTable data={data} token={token}
                                 setData={setData}
                                 pageSize={pageSize}
                                 setPageSize={setPageSize}
                                 handleOpenEditModal={handleOpenEditModal}
                                 handleSearchWithDeck={handleSearchWithDeck}
                    />
                }
            </div>
            {editId &&
                <EditModal show={showEdit} setShowEdit={setShowEdit} editId={editId}
                           handleSearchWithDeck={handleSearchWithDeck}/>
            }
        </div>
    );
};

export default withAuth(Search);
