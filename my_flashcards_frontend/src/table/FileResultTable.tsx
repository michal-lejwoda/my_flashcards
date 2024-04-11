import {FC, useState} from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useTranslation} from "react-i18next";
import {FileRowData, PropsFileData} from "../interfaces.tsx";

const columnHelper = createColumnHelper<FileRowData>()

const FileResultTable: FC<PropsFileData> = ({fileData}) => {
    console.log("fileData")
    console.log(fileData)
    const {t} = useTranslation();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const handleDelete = (index: number) => {
        console.log("handleDelete")
        console.log("index", index)
    }


    const columns = [
        columnHelper.display({
            id: 'numbers',
            header: "front_side",
            cell: (props) => {
                return (<span key={props.row.original['id']}>
                <span className="words__learn">{props.row.original['front_side']}</span>
            </span>)
            },
        }),
        columnHelper.display({
            id: 'numbers1',
            header: "back_side",
            cell: (props) => {
                return (<span key={props.row.original['id']}>
                <span className="words__learn">{props.row.original['back_side']}</span>
            </span>)
            }
        }),
        columnHelper.display({
            id: 'deleteColumn',
            header: t("delete"),
            cell: (props) => {
                return (<span key={props.row.original['id']}>
                    <button className="words__learn" onClick={() => handleDelete(props.row.index)}>Delete</button>
            </span>)
            }
        })
    ]
    // const [data,] = useState<RowData[]>(fileData);

    const table = useReactTable({
        data: fileData,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
        state: {
            pagination,
        },
    })
    // console.log(data)
    return (
        <div>
            <h1>FileResultTable</h1>
            <table>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
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
                {table.getRowModel().rows.map(row => (
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
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
            >
                {'<<'}
            </button>
            <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                {'<'}
            </button>
            {table.getCanNextPage() &&
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
            }
            {/*#TODO https://tanstack.com/table/latest/docs/guide/pagination*/}
            {table.getCanNextPage() &&
                <button
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
            }
            <select
                value={table.getState().pagination.pageSize}
                onChange={e => {
                    table.setPageSize(Number(e.target.value))
                }}
            >
                {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                        {pageSize}
                    </option>
                ))}
            </select>
            <p>Liczba słów {table.getRowCount()}</p>
        </div>
    );
};
export default FileResultTable;
