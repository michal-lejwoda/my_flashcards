import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {WordTable, WordTablewithPaginationProps} from "../interfaces.tsx";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import PaginationButton from "../components/elements/pagination/PaginationButton.tsx";
import PaginationNumber from "../components/elements/pagination/PaginationNumber.tsx";
import PaginationSelect from "../components/elements/pagination/PaginationSelect.tsx";
import Pagination from "../components/elements/pagination/Pagination.tsx";
import EditButton from "../components/elements/EditButton.tsx";
import RemoveButton from "../components/elements/RemoveButton.tsx";
import {deleteWordFromDeckOnly} from "../api.tsx";

const columnHelper = createColumnHelper<WordTable>()
const WordTablewithPagination: React.FC<WordTablewithPaginationProps> = ({
                                                                             data,
                                                                             token,
                                                                             setData,
                                                                             pageSize,
                                                                             setPageSize,
                                                                             deck_id,
                                                                             handleGetWords,
                                                                             handleOpenEditModal

                                                                         }) => {
    const {t} = useTranslation();
    const [search, setSearch] = useState("")
    const handleChangeDataBasedOnPageSize = (pg_size: string) => {
        setPageSize(Number(pg_size))
        handleGetWords(token, deck_id, search, Number(pg_size))
    }

    const handleSearch = (search_word: string) => {
        setSearch(search_word)
        handleGetWords(token, deck_id, search_word, pageSize)
    }
    const handleDeleteWord = async (id: number) => {
        await deleteWordFromDeckOnly(deck_id, id, token)
        handleGetWords(token, deck_id, search, Number(pageSize))
    }


    const columns = [
        columnHelper.accessor('front_side', {
            header: () => <span>{t("front_page")}</span>,
            size: 400,
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('back_side', {
            header: () => <span>{t("reverse_page")}</span>,
            size: 400,
            cell: info => info.getValue(),
        }),
        columnHelper.display({
            id: "edit",
            header: t("edit"),
            size: 90,
            cell: (props) => {
                return (<EditButton message={t("edit")} id={props.row.original.id} handleFunc={handleOpenEditModal}/>)
            }

        }),
        columnHelper.display({
            id: "remove",
            header: t("remove"),
            size: 90,
            cell: (props) => {
                return (<RemoveButton message={t("remove")} id={props.row.original.id} handleFunc={handleDeleteWord}/>)
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
            <h1 className="title">{t("words")}</h1>
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
                            <th key={header.id} style={{
                                width: header.column.getSize(),
                            }}>
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
                            <td key={cell.id} style={{
                                width: cell.column.getSize(),
                            }}>
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


export default WordTablewithPagination;
