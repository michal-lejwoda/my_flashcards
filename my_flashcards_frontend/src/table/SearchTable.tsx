import {ErrorResponse, SearchTableProps, SearchWordsTable} from "../interfaces.tsx";
import {deleteWord, getDecks} from "../api.tsx";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {handleGoToUrl} from "../globalFunctions.tsx";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";

const columnHelper = createColumnHelper<SearchWordsTable>()
const SearchTable: React.FC<SearchTableProps> = ({
                                                     data,
                                                     token,
                                                     setData,
                                                     pageSize,
                                                     setPageSize,
                                                     handleOpenEditModal,
                                                     handleSearchWithDeck
                                                 }) => {
    const [search,] = useState("")
    const {t} = useTranslation();
    const handleDeleteWord = async (id: number) => {
        await deleteWord(id, token)
        await handleSearchWithDeck()
    }
    const columns = [
        columnHelper.accessor('front_side', {
            header: () => <span>{t("front_page")}</span>,
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('back_side', {
            header: () => <span>{t("reverse_page")}</span>,

            cell: info => info.getValue()
        }),

        columnHelper.display({
            id: "edit",
            header: t("edit"),
            size: 1,
            enableResizing: false,
            cell: (props) => {
                return (<button onClick={() => handleOpenEditModal(props.row.original.id)}>{t("edit")}</button>)
            },
            maxSize:50


        }),
        columnHelper.display({
            id: "delete",
            header: t("remove"),
            enableResizing: false,
            cell: (props) => {
                return (<button onClick={() => handleDeleteWord(props.row.original.id)}>{t("remove")}</button>)
            },
            size: 1,
            maxSize:50
        })

    ]
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
        <div className="search_table">
            {/*<h1 className="title">{t("decks")}</h1>*/}

            <table className="search_table__table">
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
                            <td style={{
                                width: cell.column.getSize(),
                            }} key={cell.id}>
                                {/*{cell.getContext()}*/}
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
