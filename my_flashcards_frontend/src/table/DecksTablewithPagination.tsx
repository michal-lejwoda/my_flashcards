import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {NavLink} from "react-router-dom";
import {DecksTable, DecksTablewithPaginationProps} from "../interfaces.tsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {handleGoToUrl} from "../globalFunctions.tsx";

const columnHelper = createColumnHelper<DecksTable>()
const DecksTablewithPagination: React.FC<DecksTablewithPaginationProps> = ({
                                                                               data,
                                                                               token,
                                                                               setData,
                                                                               pageSize,
                                                                               setPageSize,
                                                                               handleGetDecks
                                                                           }) => {
    console.log("Data")
    console.log(data)
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const {t} = useTranslation();
    const [search, setSearch] = useState("")


    const handleChangeDataBasedOnPageSize = (pg_size: string) => {
        setPageSize(Number(pg_size))
        handleGetDecks(token, search, Number(pg_size))
    }
    // const handleGoToUrl = async (url: string | null) => {
    //     try {
    //         const url_data = await getUrl(url, token)
    //         setData(url_data)
    //     } catch (err: unknown) {
    //         const error = err as ErrorResponse
    //         console.log("error")
    //         console.log(error)
    //     }
    // }

    const handleSearch = (search_word: string) => {
        setSearch(search_word)
        handleGetDecks(token, search_word, pageSize)
    }

    const toggleDropdown = (id: number) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };
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
            cell: (props) => {
                return (
                    <div className="dropdown">
                        <button onClick={() => toggleDropdown(props.row.original.id)}>{t("actions")}</button>
                        <div className={`container ${openDropdownId === props.row.original.id ? 'open' : ''}`}>
                            <div className={`content ${openDropdownId === props.row.original.id ? 'open' : ''}`}>
                                <NavLink to="/preview" state={{id: props.row.original.id}}>{t("preview")}</NavLink>
                                <NavLink to={`/learn/${props.row.original.slug}`}
                                         state={{id: props.row.original.id, reverse: false}}>{t("learn")}</NavLink>
                                <NavLink to={`/learn/${props.row.original.slug}`} state={{
                                    id: props.row.original.id,
                                    reverse: true
                                }}>{t("reverse_and_learn")}</NavLink>
                                <a>{t("rename")}</a>
                                <a>{t("share")}</a>
                                <a>{t("delete")}</a>
                            </div>
                        </div>
                    </div>
                )
            }
        })
    ]

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
                <button onClick={() => handleGoToUrl(data.links.first_page_link,token,setData)}>{'<<'}</button>
            }
            {data.links.previous &&
                <button onClick={() => handleGoToUrl(data.links.previous,token,setData)}>{'<'}</button>
            }
            {data.current_page} {t('of')} {data.total_pages}
            {data.links.next &&
                <button onClick={() => handleGoToUrl(data.links.next,token,setData)}>{'>'}</button>
            }

            {data.links.last_page_link &&
                <button onClick={() => handleGoToUrl(data.links.last_page_link,token,setData)}>{'>>'}</button>
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


export default DecksTablewithPagination;
