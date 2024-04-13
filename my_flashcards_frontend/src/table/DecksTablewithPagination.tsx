import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {NavLink} from "react-router-dom";
import {DecksTable, DecksTablewithPaginationProps, ErrorResponse} from "../interfaces.tsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {getDecks} from "../api.tsx";

const columnHelper = createColumnHelper<DecksTable>()
const DecksTablewithPagination: React.FC<DecksTablewithPaginationProps> = ({data, token}) => {
    console.log("Data")
    console.log(data)
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const {t} = useTranslation();
    const handleGetDecks = async (token: string | null, search: string | null) => {
        try {
            const get_decks = await getDecks(token, search)
            console.log("get_decks")
            console.log(get_decks)
            // setData(get_decks)
        } catch (err: unknown) {
            // #TODO Back HEre
            const error = err as ErrorResponse
            console.log("error")
            console.log(error)
        }
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
        firstPage,
        getCanNextPage,
        getCanPreviousPage,
        nextPage,
        lastPage,
        getRowModel,
        previousPage

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
                    onChange={e => handleGetDecks(token, e.target.value)}
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
            <button
                onClick={() => firstPage()}
                disabled={!getCanPreviousPage()}
            >
                {'<<'}
            </button>
            <button
                onClick={() => previousPage()}
                disabled={!getCanPreviousPage()}
            >
                {'<'}
            </button>
            {getCanNextPage() &&
                <button
                    onClick={() => nextPage()}
                    disabled={!getCanNextPage()}
                >
                    {'>'}
                </button>
            }
            {/*#TODO https://tanstack.com/table/latest/docs/guide/pagination*/}
            {getCanNextPage() &&
                <button
                    onClick={() => lastPage()}
                    disabled={!getCanNextPage()}
                >
                    {'>>'}
                </button>
            }


        </div>
    );
};


export default DecksTablewithPagination;
