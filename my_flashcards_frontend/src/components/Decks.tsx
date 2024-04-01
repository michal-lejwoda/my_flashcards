import {useTranslation} from "react-i18next";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import React, {useState} from "react";
import {DecksTable} from "../interfaces.tsx";
import "../sass/decks.css"
import {NavLink} from "react-router-dom";


const defaultData: DecksTable[] = [
    {
        id: 1,
        name: "slowka1",
        slug: "slowka1",
        learn: 4,
        correct: 76,
        wrong: 12,
        all: 92
    },
    {
        id: 2,
        name: "slowka2",
        slug: "slowka2",
        learn: 5,
        correct: 12,
        wrong: 0,
        all: 17
    },
    {
        id: 3,
        name: "slowka3",
        slug: "slowka3",
        learn: 15,
        correct: 0,
        wrong: 0,
        all: 15
    },
]

const columnHelper = createColumnHelper<DecksTable>()


const Decks = () => {
    const [data,] = React.useState(() => [...defaultData])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const {t} = useTranslation();

    const toggleDropdown = (id: number) => {
        setOpenDropdownId(openDropdownId === id ? null : id); // Zmienia stan otwarcia dropdowna
    };

    const columns = [
        columnHelper.accessor('name', {
            header: () => <span>Name</span>,
            cell: info => info.getValue(),

        }),
        columnHelper.display({
            id: 'numbers',
            header: t("words"),
            cell: (props) => {
                return (<span>
                <span className="words__learn">{props.row.original.learn}</span> -
                <span className="words__correct">{props.row.original.correct}</span> -
                <span className="words__wrong">{props.row.original.wrong} </span>
                 | <span className="words__all">{props.row.original.all}</span>
            </span>)
            },
        }),
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

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        state: {
            globalFilter,
        },
    })

    return (
        <div className="decks">
            <h1 className="title">{t("decks")}</h1>
            <div className="decks__searchcontainer searchcontainer">
                <input value={globalFilter ?? ''}
                       onChange={e => setGlobalFilter(String(e.target.value))}
                       className="searchcontainer__search"
                       placeholder={t("search")}/>
            </div>
            <table className="decks__table">
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


        </div>
    );
};

export default Decks;
