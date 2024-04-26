import {SearchTableProps, SearchWordsTable} from "../interfaces.tsx";
import {deleteWord} from "../api.tsx";
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import React from "react";
import {useTranslation} from "react-i18next";
import RemoveButton from "../components/elements/RemoveButton.tsx";
import EditButton from "../components/elements/EditButton.tsx";
import Pagination from "../components/elements/pagination/Pagination.tsx";
import PaginationButton from "../components/elements/pagination/PaginationButton.tsx";
import PaginationSelect from "../components/elements/pagination/PaginationSelect.tsx";
import PaginationNumber from "../components/elements/pagination/PaginationNumber.tsx";

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
    const {t} = useTranslation();

    const handleDeleteWord = async (id: number) => {
        await deleteWord(id, token)
        await handleSearchWithDeck()
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
            cell: info => info.getValue()
        }),

        columnHelper.display({
            id: "edit",
            header: t("edit"),
            enableResizing: false,
            cell: (props) => {
                return (<EditButton message={t("edit")} id={props.row.original.id} handleFunc={handleOpenEditModal}/>)
            },


        }),
        columnHelper.display({
            id: "delete",
            header: t("remove"),
            enableResizing: false,
            cell: (props) => {
                return (<RemoveButton message={t("remove")} id={props.row.original.id} handleFunc={handleDeleteWord}/>)
            },
            size: 1,
        })

    ]
    const handleChangeDataBasedOnPageSize = (pg_size: string) => {
        setPageSize(Number(pg_size))
    }


    const {
        getHeaderGroups,
        getRowModel,
    } = useReactTable({
        data: data.results,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <div className="search_table">
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
                        {row.getVisibleCells().map(cell => {
                            return (
                                <td
                                    key={cell.id}
                                    style={{
                                        width: cell.column.getSize(),
                                    }}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            );
                        })}
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

export default SearchTable;
