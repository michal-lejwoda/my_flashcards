import {useTranslation} from "react-i18next";
import {useContext, useEffect, useState} from "react";
import {DecksResponseTable, ErrorResponse} from "../interfaces.tsx";
import "../sass/decks.css"
import withAuth from "../context/withAuth.tsx";
import AuthContext from "../context/AuthContext.tsx";
import DecksTablewithPagination from "../table/DecksTablewithPagination.tsx";
import {getDecks} from "../api.tsx";


const Decks = () => {
    //TODO Resolve problem of double rendering
    const {token} = useContext(AuthContext);
    const [data,setData] = useState<DecksResponseTable | null>(null)
    const {t} = useTranslation();
    console.log("data1")
    console.log(data)
    const handleGetDecks = async (token: string | null, search: string | null) => {
        try {
            const get_decks = await getDecks(token, search)
            console.log("get_decks")
            console.log(get_decks)
            setData(get_decks)
        } catch (err: unknown) {
            // #TODO Back HEre
            const error = err as ErrorResponse
            console.log("error")
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetDecks(token, null);
    }, [token])


    return (
        <div className="decks">
            <h1 className="title">{t("decks")}</h1>
            {data && data.results &&
                <DecksTablewithPagination data={data}  token={token} setData={setData}/>
            }
            {/*<table className="decks__table">*/}
            {/*    <thead>*/}
            {/*    {getHeaderGroups().map(headerGroup => (*/}
            {/*        <tr key={headerGroup.id}>*/}
            {/*            {headerGroup.headers.map(header => (*/}
            {/*                <th key={header.id}>*/}
            {/*                    {header.isPlaceholder*/}
            {/*                        ? null*/}
            {/*                        : flexRender(*/}
            {/*                            header.column.columnDef.header,*/}
            {/*                            header.getContext()*/}
            {/*                        )}*/}
            {/*                </th>*/}
            {/*            ))}*/}
            {/*        </tr>*/}
            {/*    ))}*/}
            {/*    </thead>*/}
            {/*    <tbody>*/}
            {/*    {getRowModel().rows.map(row => (*/}
            {/*        <tr key={row.id}>*/}
            {/*            {row.getVisibleCells().map(cell => (*/}
            {/*                <td key={cell.id}>*/}
            {/*                    {flexRender(cell.column.columnDef.cell, cell.getContext())}*/}
            {/*                </td>*/}
            {/*            ))}*/}
            {/*        </tr>*/}
            {/*    ))}*/}
            {/*    </tbody>*/}
            {/*</table>*/}
            {/*<button*/}
            {/*    onClick={() => firstPage()}*/}
            {/*    disabled={!getCanPreviousPage()}*/}
            {/*>*/}
            {/*    {'<<'}*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => previousPage()}*/}
            {/*    disabled={!getCanPreviousPage()}*/}
            {/*>*/}
            {/*    {'<'}*/}
            {/*</button>*/}
            {/*{getCanNextPage() &&*/}
            {/*    <button*/}
            {/*        onClick={() => nextPage()}*/}
            {/*        disabled={!getCanNextPage()}*/}
            {/*    >*/}
            {/*        {'>'}*/}
            {/*    </button>*/}
            {/*}*/}
            {/*/!*#TODO https://tanstack.com/table/latest/docs/guide/pagination*!/*/}
            {/*{getCanNextPage() &&*/}
            {/*    <button*/}
            {/*        onClick={() => lastPage()}*/}
            {/*        disabled={!getCanNextPage()}*/}
            {/*    >*/}
            {/*        {'>>'}*/}
            {/*    </button>*/}
            {/*}*/}


        </div>
    );
};

export default withAuth(Decks);
