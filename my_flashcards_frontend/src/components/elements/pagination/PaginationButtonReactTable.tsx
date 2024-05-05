import React from "react";
import {PaginationButtonReactTableProps} from "../../../interfaces.tsx";


const PaginationButtonReactTable: React.FC<PaginationButtonReactTableProps> = ({onClick, disabled, message}) => {
    return (
        // <button className="pagination--button" onClick={() => handleGoToUrl(link, token, setData)}>{message}</button>
        <button
            className="pagination--button"
            onClick={() => onClick()}
            disabled={disabled}
        >
            {message}
        </button>
    );
};

export default PaginationButtonReactTable;
