import {FC, useState} from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";


const data1 = [
    [
        "either way",
        "tak czy inaczej"
    ],
    [
        "donor",
        "dawca"
    ],
    [
        "discharged",
        "zwolniony"
    ],
    [
        "right femur",
        "prawa kość udowa"
    ],
    [
        "fracture",
        "złamanie"
    ],
    [
        "admit",
        "przyznać"
    ],
    [
        "grudge",
        "uraz"
    ],
    [
        "corpse",
        "zwłoki"
    ],
    [
        "blooming red",
        "kwitnąca czerwień"
    ],
    [
        "stall",
        "stragan, stoisko"
    ],
    [
        "I can relate",
        "Mogę się zgodzić"
    ],
    [
        "wipe",
        "wytarty, przetarty"
    ],
    [
        "restroom",
        "toaleta"
    ],
    [
        "That's definetely odd",
        "To dziwne"
    ],
    [
        "equivelant to",
        "odpowiednik"
    ],
    [
        "couldnt resist",
        "Nie mogłem się oprzeć"
    ],
    [
        "proceed",
        "kontynuować"
    ],
    [
        "according to",
        "zgodnie z"
    ],
    [
        "track record",
        "osiągnięcia"
    ],
    [
        "sue",
        "pozwać"
    ],
    [
        "approach",
        "metoda"
    ],
    [
        "associate",
        "współpracownicy"
    ],
    [
        "obvious",
        "oczywisty"
    ],
    [
        "settle",
        "załatwić"
    ],
    [
        "wittness",
        "świadek"
    ],
    [
        "proof",
        "dowód"
    ],
    [
        "proofed",
        "zabezpieczony, zaimpregnowany"
    ],
    [
        "cut to the bone",
        "obcięte do minimum"
    ],
    [
        "commit",
        "popełnić"
    ],
    [
        "market",
        "rynek"
    ],
    [
        "cure for everything",
        "lek na wszystko"
    ],
    [
        "discouraged me",
        "zniechęciło mnie"
    ],
    [
        "inherit",
        "odziedziczyć"
    ],
    [
        "i know so",
        "Ja to wiem"
    ],
    [
        "transmit",
        "transmitować, przesyłać"
    ],
    [
        "commence",
        "rozpoczynać"
    ],
    [
        "beyond solution",
        "poza standardem"
    ],
    [
        "atop",
        "na szczycie"
    ],
    [
        "atop",
        "na szczycie"
    ],
    [
        "atop",
        "na szczycie"
    ]
]
console.log("data1")
console.log(data1)
const columnHelper = createColumnHelper<string[]>()

interface Props {
  fileData: [string, string][] | null;
}

const FileResultTable: FC<Props> = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });
    const columns = [
        columnHelper.display({
            id: 'numbers',
            header: "front_side",
            cell: (props) => {
                return (<span>
                <span className="words__learn">{props.row.original[0]}</span>
            </span>)
            },
        }),
        columnHelper.display({
            id: 'numbers1',
            header: "back_side",
            cell: (props) => {
                return (<span>
                <span className="words__learn">{props.row.original[1]}</span>
            </span>)
            }
        })
    ]
    const [data,] = useState<string[][]>(data1);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
        state: {
            pagination,
        },
    })
    console.log(data)
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
            {table.getCanNextPage() &&
            <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                {'>'}
            </button>
            }
        </div>
    );
};
export default FileResultTable;
