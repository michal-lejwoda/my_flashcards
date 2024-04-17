import SearchTable from "../table/SearchTable.tsx";
import {useContext, useEffect, useState} from "react";
import {searchWordWithDeck} from "../api.tsx";
import AuthContext from "../context/AuthContext.tsx";
import {ErrorResponse, SearchWordsResponseTable} from "../interfaces.tsx";
import withAuth from "../context/withAuth.tsx";
import EditModal from "../modals/EditModal.tsx";

const Search = () => {
    const [searchWord, setSearchWord] = useState("")
    const {token} = useContext(AuthContext);
    const [data, setData] = useState<SearchWordsResponseTable | null>(null)
    const [pageSize, setPageSize] = useState(10)
    const [editId, setEditIt] = useState<number | null>(null)
    const [showEdit, setShowEdit] = useState(false)
    console.log(editId)
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
            <h1>Search</h1>
            {/*<input onChange={(e) => handleSearch(e.target.value)} type="text"/>*/}
            <input onChange={(e) => setSearchWord(e.target.value)} type="text"/>
            {/*<button>{t("search")}</button>*/}
            {data && data.results &&
                <SearchTable data={data} token={token}
                             setData={setData} pageSize={pageSize}
                             setPageSize={setPageSize}
                             setEditIt={setEditIt}
                    // handleGetDecks={handleGetDecks}/>
                />
            }
            <EditModal show={showEdit} setShowEdit={setShowEdit} editId={editId}/>
        </div>
    );
};

export default withAuth(Search);
