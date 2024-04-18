import SearchTable from "../table/SearchTable.tsx";
import {useContext, useEffect, useState} from "react";
import {searchWordWithDeck} from "../api.tsx";
import AuthContext from "../context/AuthContext.tsx";
import {ErrorResponse, SearchWordsResponseTable} from "../interfaces.tsx";
import withAuth from "../context/withAuth.tsx";
import EditModal from "../modals/EditModal.tsx";
import {useTranslation} from "react-i18next";

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
            const response = await searchWordWithDeck(searchWord, token)
            setData(response)
        } catch (err: unknown) {
            // #TODO Back HEre
            const error = err as ErrorResponse
            console.log("error")
            console.log(error)
        }
    }
    useEffect(() => {
        if (searchWord.length > 2) {
            handleSearchWithDeck()
        }
    }, [searchWord])
    console.log(data)

    return (
        <div className="search">
            <h1>{t("search")}</h1>
            <input onChange={(e) => setSearchWord(e.target.value)} type="text"/>
            {data && data.results &&
                <SearchTable data={data} token={token}
                             setData={setData} pageSize={pageSize}
                             setPageSize={setPageSize}
                             handleOpenEditModal={handleOpenEditModal}
                             handleSearchWithDeck={handleSearchWithDeck}
                />
            }
            {editId &&
                <EditModal show={showEdit} setShowEdit={setShowEdit} editId={editId} handleSearchWithDeck={handleSearchWithDeck}/>
            }
        </div>
    );
};

export default withAuth(Search);
