import {FC, useContext, useEffect, useMemo, useState} from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useTranslation} from "react-i18next";
import {ErrorResponse, FileRowData, PropsFileData} from "../interfaces.tsx";
import {postDeckWithWords} from "../api.tsx";
import AuthContext from "../context/AuthContext.tsx";
import PaginationButtonReactTable from "../components/elements/pagination/PaginationButtonReactTable.tsx";
import Pagination from "../components/elements/pagination/Pagination.tsx";
import PaginationSelect from "../components/elements/pagination/PaginationSelect.tsx";
import PaginationNumber from "../components/elements/pagination/PaginationNumber.tsx";
import RemoveButton from "../components/elements/RemoveButton.tsx";
import EditButton from "../components/elements/EditButton.tsx";
import InputField from "../components/elements/InputField.tsx";
import {useFormik} from "formik";
import {changeCreateDataFromFileValidation} from "../validation.tsx";
import GreenButton from "../components/elements/GreenButton.tsx";
import {useNavigate} from "react-router-dom";

const columnHelper = createColumnHelper<FileRowData>()

const FileResultTable: FC<PropsFileData> = ({fileData, setFileData, pagination, setPagination}) => {
    const {token} = useContext(AuthContext);
    const [errorData, setErrorData] = useState("")
    const navigate = useNavigate();
    const handleSendData = async () => {
        setErrorData("")
        const data = {
            "name": values.deck,
            "rows": fileData
        }
        try {
            await postDeckWithWords(data, token)
            await navigate("/")
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            if (
                error.response &&
                error.response.data &&
                'name' in error.response.data &&
                typeof error.response.data.name === 'string'
            ) {
                setErrorData(error.response.data.name);
            } else {
                setErrorData(t("problem_with_file_data"));
            }
        }


    }
    const {t} = useTranslation();
    const columns = useMemo(() => [
        columnHelper.display({
            id: 'front_side',
            header: t("front_page"),
            size: 400,
            cell: (props) => {
                return (<span key={props.row.original['id']}>
                <span className="words__learn">{props.row.original['front_side']}</span>
            </span>)
            },
        }),
        columnHelper.display({
            id: 'back_side',
            header: t("reverse_page"),
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
                    <RemoveButton
                        id={props.row.original['id']}
                        message={t("delete")}
                        handleFunc={handleDelete}
                    />
            </span>)
            }
        }),
        columnHelper.display({
            id: 'changeColumn',
            header: t("change_places"),
            size: 90,
            cell: (props) => {
                return (
                    <EditButton
                        id={props.row.original['id']}
                        message={t("change")}
                        handleFunc={handleChangePlace}
                    />)

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

    const handleChangePlace = (id: number) => {
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
    const {values, handleChange, handleSubmit, errors} = useFormik({
        initialValues: {
            deck: ""
        },
        validationSchema: changeCreateDataFromFileValidation,
        validateOnChange: false,
        onSubmit: async () => {
            try {
                handleSendData();
            } catch (error) {
                alert(t("reset_password_error"))
            }
        },
    });
    const changeAll = () => {
        const tempFile = fileData.slice()
        for (const obj of tempFile) {
            const temp = obj.front_side;
            obj.front_side = obj.back_side;
            obj.back_side = temp;
        }
        setFileData(tempFile)
    }

    return (
        <div className="file-result">
            <form className="file-result__form" onSubmit={handleSubmit}>
                <div className="file-result__container">
                    <InputField
                        name="deck"
                        label={t("deck_name")}
                        type="text"
                        handleChange={handleChange}
                        value={values.deck}
                    />
                    <div className="errors form__errors">
                        {errors.deck && <p className="form__error form__message">{errors.deck}</p>}
                        {errorData && <p>{errorData}</p>}
                    </div>
                </div>
                <div className="file-result__button">
                    <GreenButton message={t("create")}/>
                </div>
                <div className="file-result__button">
                    <button className="greenoutline--button" onClick={(e) => {
                        e.preventDefault();
                        changeAll();
                    }}>{t("change_all")}</button>
                </div>

            </form>
            <table className="file-result__table">
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
            <p className="file-result__words-num">{t("number_of_words")} {getRowCount()}</p>

        </div>
    );
};
export default FileResultTable;
