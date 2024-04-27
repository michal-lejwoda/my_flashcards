import React from "react";
import {PaginationSelectProps} from "../../../interfaces.tsx";


const PaginationSelectReactTable: React.FC<PaginationSelectProps> = ({pageSize, handleChange}) => {
    return (
        <select
            className="pagination--select"
            value={pageSize}
            onChange={e => {
                handleChange(e.target.value)
            }}
        >
            {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                    {pageSize}
                </option>
            ))}
        </select>
    );
};

export default PaginationSelectReactTable;
