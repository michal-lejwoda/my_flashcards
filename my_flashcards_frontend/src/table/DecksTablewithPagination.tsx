import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {NavLink} from "react-router-dom";
import {DecksTable, DecksTablewithPaginationProps} from "../interfaces.tsx";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import PaginationButton from "../components/elements/pagination/PaginationButton.tsx";
import PaginationNumber from "../components/elements/pagination/PaginationNumber.tsx";
import PaginationSelect from "../components/elements/pagination/PaginationSelect.tsx";
import Pagination from "../components/elements/pagination/Pagination.tsx";

const columnHelper = createColumnHelper<DecksTable>()
const DecksTablewithPagination: React.FC<DecksTablewithPaginationProps> = ({
                                                                               data,
                                                                               token,
                                                                               setData,
                                                                               pageSize,
                                                                               setPageSize,
                                                                               handleGetDecks
                                                                           }) => {
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const {t} = useTranslation();
    const [search, setSearch] = useState("")

    const handleChangeDataBasedOnPageSize = (pg_size: string) => {
        setPageSize(Number(pg_size))
        handleGetDecks(token, search, Number(pg_size))
    }

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
            size: 700
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
                                <NavLink className="dropdown__element" to="/preview" state={{deck: props.row.original}}>{t("preview")}</NavLink>
                                <NavLink className="dropdown__element" to={`/learn/${props.row.original.slug}`}
                                         state={{id: props.row.original.id, reverse: false}}>{t("learn")}</NavLink>
                                <NavLink className="dropdown__element" to={`/learn/${props.row.original.slug}`} state={{
                                    id: props.row.original.id,
                                    reverse: true
                                }}>{t("reverse_and_learn")}</NavLink>
                                <a className="dropdown__element">{t("rename")}</a>
                                {/*<a className="dropdown__element">{t("share")}</a>*/}
                                <a className="dropdown__element">{t("remove")}</a>
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
    })
    return (
        <div className="decks">
            <div className="decks__searchcontainer searchcontainer">
                <input
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
                            <td key={cell.id}
                                style={{
                                        width: cell.column.getSize(),
                                    }}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination>
                {data.links.first_page_link &&
                    <PaginationButton link={data.links.first_page_link} token={token} message={'<<'} setData={setData}/>
                }
                {data.links.previous &&
                    <PaginationButton link={data.links.previous} token={token} message={'<'} setData={setData}/>
                }
                <PaginationNumber current_page={data.current_page} total_pages={data.total_pages}/>
                {data.links.next &&
                    <PaginationButton link={data.links.next} token={token} message={'>'} setData={setData}/>
                }

                {data.links.last_page_link &&
                    <PaginationButton link={data.links.last_page_link} token={token} message={'>>'} setData={setData}/>
                }
                <PaginationSelect
                    pageSize={pageSize}
                    handleChange={handleChangeDataBasedOnPageSize}
                />
            </Pagination>
        </div>
    );
};


export default DecksTablewithPagination;
