import {useTranslation} from "react-i18next";
import {useContext, useEffect, useState} from "react";
import {DecksResponseTable} from "../interfaces.tsx";
import "../sass/decks.css"
import withAuth from "../context/withAuth.tsx";
import AuthContext from "../context/AuthContext.tsx";
import DecksTablewithPagination from "../table/DecksTablewithPagination.tsx";
import {getDecks} from "../api.tsx";


const Decks = () => {
    //TODO Resolve problem of double rendering
    const {token} = useContext(AuthContext);
    const [data, setData] = useState<DecksResponseTable | null>(null)
    const {t} = useTranslation();
    const [pageSize, setPageSize] = useState(10)
    const handleGetDecks = async (token: string | null, search: string | null, pageSize: number) => {
        try {
            const get_decks = await getDecks(token, search, pageSize)
            setData(get_decks)
        } catch {
            // Blank
        }
    }


    useEffect(() => {
        handleGetDecks(token, null, pageSize);
    }, [token])


    return (
        <div className="decks">
            <h1 className="title">{t("decks")}</h1>
            {data && data.results &&
                <DecksTablewithPagination data={data} token={token}
                                          setData={setData} pageSize={pageSize}
                                          setPageSize={setPageSize}
                                          handleGetDecks={handleGetDecks}

                />
            }
        </div>
    );
};

export default withAuth(Decks);
