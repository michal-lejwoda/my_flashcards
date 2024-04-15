import {DecksTable, ErrorResponse, SearchTableProps} from "../interfaces.tsx";
import {getDecks} from "../api.tsx";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {handleGoToUrl} from "../globalFunctions.tsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";

const columnHelper = createColumnHelper<DecksTable>()
const SearchTable: React.FC<SearchTableProps> = ({
                                                     data,
                                                     token,
                                                     setData,
                                                     pageSize,
                                                     setPageSize,
                                                 }) => {
    const [search, setSearch] = useState("")
    const {t} = useTranslation();
    const columns = [
        columnHelper.accessor('name', {
            header: () => <span>Name</span>,
            cell: info => info.getValue(),
        }),
        //TODO Back here after fix
        // columnHelper.display({
        //     id: 'numbers',
        //     header: t("words"),
        //     cell: (props) => {
        //         return (<span>
        //         <span className="words__learn">{props.row.original.learn}</span> -
        //         <span className="words__correct">{props.row.original.correct}</span> -
        //         <span className="words__wrong">{props.row.original.wrong} </span>
        //          | <span className="words__all">{props.row.original.all}</span>
        //     </span>)
        //     },
        // }),
        columnHelper.display({
            id: "actions",
            header: t("actions"),
            // cell: (props) => {
            //     return (
            //         <div className="dropdown">
            //             <button onClick={() => toggleDropdown(props.row.original.id)}>{t("actions")}</button>
            //             <div className={`container ${openDropdownId === props.row.original.id ? 'open' : ''}`}>
            //                 <div className={`content ${openDropdownId === props.row.original.id ? 'open' : ''}`}>
            //                     <NavLink to="/preview" state={{id: props.row.original.id}}>{t("preview")}</NavLink>
            //                     <NavLink to={`/learn/${props.row.original.slug}`}
            //                              state={{id: props.row.original.id, reverse: false}}>{t("learn")}</NavLink>
            //                     <NavLink to={`/learn/${props.row.original.slug}`} state={{
            //                         id: props.row.original.id,
            //                         reverse: true
            //                     }}>{t("reverse_and_learn")}</NavLink>
            //                     <a>{t("rename")}</a>
            //                     <a>{t("share")}</a>
            //                     <a>{t("delete")}</a>
            //                 </div>
            //             </div>
            //         </div>
            //     )
            // }
        })
    ]
    const handleSearch = (search_word: string) => {
        setSearch(search_word)
        handleSearchTable(search_word)
    }
    const handleSearchTable = async (search: string | null) => {
        try {
            const get_decks = await getDecks(token, search, pageSize)
            setData(get_decks)
        } catch (err: unknown) {
            // #TODO Back HEre
            const error = err as ErrorResponse
            console.log("error")
            console.log(error)
        }
    }
    console.log("data")
    console.log(data)
    const handleChangeDataBasedOnPageSize = (pg_size: string) => {
        setPageSize(Number(pg_size))
        handleSearchTable(search)
    }


    const {
        getHeaderGroups,
        getRowModel,
    } = useReactTable({
        data: data.results,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })
    return (
        <div className="decks">
            <h1 className="title">{t("decks")}</h1>
            <div className="decks__searchcontainer searchcontainer">
                <input
                    // value={globalFilter ?? ''}
                    // onChange={e => setGlobalFilter(String(e.target.value))}
                    onChange={e => handleSearch(e.target.value)}
                    className="searchcontainer__search"
                    placeholder={t("search")}/>
            </div>
            <table className="decks__table">
                <thead>
                {getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            {data.links.first_page_link &&
                <button onClick={() => handleGoToUrl(data.links.first_page_link, token, setData)}>{'<<'}</button>
            }
            {data.links.previous &&
                <button onClick={() => handleGoToUrl(data.links.previous, token, setData)}>{'<'}</button>
            }
            {data.current_page} {t('of')} {data.total_pages}
            {data.links.next &&
                <button onClick={() => handleGoToUrl(data.links.next, token, setData)}>{'>'}</button>
            }

            {data.links.last_page_link &&
                <button onClick={() => handleGoToUrl(data.links.last_page_link, token, setData)}>{'>>'}</button>
            }
            <select
                value={pageSize}
                onChange={e => {
                    handleChangeDataBasedOnPageSize(e.target.value)
                }}
            >
                {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                        {pageSize}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SearchTable;
