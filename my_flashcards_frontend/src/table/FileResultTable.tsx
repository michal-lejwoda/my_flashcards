import React, {FC, useContext, useEffect, useMemo} from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useTranslation} from "react-i18next";
import {FileRowData, PropsFileData} from "../interfaces.tsx";
import {postDeckWithWords} from "../api.tsx";
import AuthContext from "../context/AuthContext.tsx";
import PaginationButtonReactTable from "../components/elements/pagination/PaginationButtonReactTable.tsx";
import Pagination from "../components/elements/pagination/Pagination.tsx";
import PaginationSelect from "../components/elements/pagination/PaginationSelect.tsx";
import PaginationNumber from "../components/elements/pagination/PaginationNumber.tsx";

const columnHelper = createColumnHelper<FileRowData>()

const FileResultTable: FC<PropsFileData> = ({fileData, setFileData, pagination, setPagination}) => {
    const {token} = useContext(AuthContext);
    const handleSendData = () => {
        const data = {
            "name": "saffsaasffas",
            "rows": fileData
        }
        // #TODO ADD exception
        postDeckWithWords(data, token)
    }
    const {t} = useTranslation();
    const columns = useMemo(() => [
        columnHelper.display({
            id: 'front_side',
            header: "front_side",
            size: 400,
            cell: (props) => {
                return (<span key={props.row.original['id']}>
                <span className="words__learn">{props.row.original['front_side']}</span>
            </span>)
            },
        }),
        columnHelper.display({
            id: 'back_side',
            header: "back_side",
            size: 400,
            cell: (props) => {
                return (<span key={props.row.original['id']}>
                <span className="words__learn">{props.row.original['back_side']}</span>
            </span>)
            }
        }),
        columnHelper.display({
            id: 'deleteColumn',
            header: t("delete"),
            size: 90,
            cell: (props) => {
                return (<span key={props.row.original['id']}>
                    <button className="words__learn"
                            onClick={() => handleDelete(props.row.original['id'])}>Delete</button>
            </span>)
            }
        }),
        columnHelper.display({
            id: 'changeColumn',
            header: t("change"),
            size: 90,
            cell: (props) => {
                return (<span key={props.row.original['id']}>
                    <button className="words__learn" onClick={() => handleChange(props.row.original['id'])}>Change places</button>
            </span>)
            }
        })
    ], [])
    const {
        getHeaderGroups,
        getState,
        getRowCount,
        getRowModel,
        firstPage,
        getCanPreviousPage,
        previousPage,
        getCanNextPage,
        nextPage,
        lastPage,
        setPageSize,
        getPageCount,
        setPageIndex
    } = useReactTable({
        data: fileData,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
        autoResetPageIndex: false
    })
    useEffect(() => {
        const index = getState().pagination.pageIndex
        const page_count = getPageCount()
        if (index !== 0) {
            if (page_count >= index) {
                setPageIndex(page_count - 1)
            }
        }
    }, [fileData])
    const handleDelete = (id: number) => {
        setFileData(prevFileData => {
            if (prevFileData !== null) {
                const indexToDelete = prevFileData.findIndex(obj => obj.id === id);
                if (indexToDelete !== -1) {
                    return [...prevFileData.slice(0, indexToDelete), ...prevFileData.slice(indexToDelete + 1)];
                }
            }
            return prevFileData;
        });
    };

    const handleChange = (id: number) => {
        // const pageindex = getState().pagination.pageIndex
        const tempFile = fileData.slice()
        for (const obj of tempFile) {
            if (obj.id === id) {
                const temp = obj.front_side;
                obj.front_side = obj.back_side;
                obj.back_side = temp;
                break;
            }
        }
        setFileData(tempFile)

    }
    const handleChangeDataBasedOnPageSize = (pg_size: string) => {
        setPageSize(Number(pg_size))
    }

    return (
        <div className="decks">
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
                <PaginationButtonReactTable
                    onClick={() => firstPage()}
                    disabled={!getCanPreviousPage()}
                    message={'<<'}
                />
                <PaginationButtonReactTable
                    onClick={() => previousPage()}
                    disabled={!getCanPreviousPage()}
                    message={'<'}
                />
                <PaginationNumber current_page={getState().pagination.pageIndex + 1} total_pages={getPageCount()}/>
                {getCanNextPage() &&
                    <PaginationButtonReactTable
                        onClick={() => nextPage()}
                        disabled={!getCanNextPage()}
                        message={'>'}
                    />

                }
                {getCanNextPage() &&
                    <PaginationButtonReactTable
                        onClick={() => lastPage()}
                        disabled={!getCanNextPage()}
                        message={'>>'}
                    />

                }
                <PaginationSelect
                    pageSize={getState().pagination.pageSize}
                    handleChange={handleChangeDataBasedOnPageSize}
                />

            </Pagination>
            {/*{[10, 20, 30, 40, 50].map(pageSize => (*/}
            {/*    <option key={pageSize} value={pageSize}>*/}
            {/*        {pageSize}*/}
            {/*    </option>*/}
            {/*))}*/}


            {/*<strong>{getState().pagination.pageIndex + 1} of{" "} {getPageCount()}</strong>*/}
            <p>{t("number_of_words")} {getRowCount()}</p>
            <button onClick={handleSendData}>Wyślij</button>
        </div>
    );
};
export default FileResultTable;
