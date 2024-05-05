import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {NavLink, useNavigate} from "react-router-dom";
import {DecksTable, DecksTablewithPaginationProps} from "../interfaces.tsx";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import PaginationButton from "../components/elements/pagination/PaginationButton.tsx";
import PaginationNumber from "../components/elements/pagination/PaginationNumber.tsx";
import PaginationSelect from "../components/elements/pagination/PaginationSelect.tsx";
import Pagination from "../components/elements/pagination/Pagination.tsx";
import LearnDoneModal from "../modals/LearnDoneModal.tsx";


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
    const [showLearnDone, setShowLearnDone] = useState(false)
    const navigate = useNavigate();
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
    const handleGoToLearn = (id: number, wrong_words: number, words_to_learn: number, reverse: boolean) => {
        if(wrong_words <= 0 && words_to_learn <=0){
            setShowLearnDone(true)
        }else{
            navigate('/learn', { state: { id: id, reverse: reverse } });
        }
    }



    const columns = [
        columnHelper.accessor('name', {
            header: () => <span>{t("name")}</span>,
            cell: info => {
                return (
                    <div className="decks__table--name" onClick={()=>handleGoToLearn(info.row.original.id, info.row.original.num_of_wrong_words, info.row.original.num_of_words_to_learn, false)}>
                        {info.getValue()}
                    </div>
                )
            },
            size: 700
        }),
        columnHelper.display({
            id: "info",
            header: t("info"),
            cell: (props) => {
                return (
                    <div className="decks__table--info">
                        <span className="singlebutton--wrong">{props.row.original.num_of_wrong_words}</span>/<span
                        className="singlebutton--correct">{props.row.original.num_of_words_to_learn}</span>
                    </div>
                )
            }
        }),
        columnHelper.display({
            id: "actions",
            header: t("actions"),
            cell: (props) => {
                return (
                    <div className="dropdown">
                        <button className="dropdown__button" onClick={() => toggleDropdown(props.row.original.id)}>{t("actions")}</button>
                        <div className={`container ${openDropdownId === props.row.original.id ? 'open' : ''}`}>
                            <div className={`content ${openDropdownId === props.row.original.id ? 'open' : ''}`}>
                                <NavLink className="dropdown__element" to="/preview"
                                         state={{deck: props.row.original}}>{t("preview")}</NavLink>
                                <a className="dropdown__element"
                                   onClick={() => handleGoToLearn(props.row.original.id, props.row.original.num_of_wrong_words, props.row.original.num_of_words_to_learn, false)}>
                                    {t("learn")}
                                </a>
                                <a className="dropdown__element"
                                   onClick={() => handleGoToLearn(props.row.original.id, props.row.original.num_of_wrong_words, props.row.original.num_of_words_to_learn, true)}>
                                    {t("reverse_and_learn")}
                                </a>
                                <NavLink className="dropdown__element" to="/browse"
                                         state={{id: props.row.original.id, reverse: false}}>{t("browse")}</NavLink>
                                <NavLink className="dropdown__element" to="/browse" state={{
                                    id: props.row.original.id,
                                    reverse: true
                                }}>{t("reverse_and_browse")}</NavLink>
                                {/*#TODO MOre functions*/}
                                {/*<a className="dropdown__element">{t("rename")}</a>*/}
                                {/*<a className="dropdown__element">{t("remove")}</a>*/}
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
            <LearnDoneModal showLearnDone={showLearnDone} setShowLearnDone={setShowLearnDone}/>
        </div>
    );
};


export default DecksTablewithPagination;
