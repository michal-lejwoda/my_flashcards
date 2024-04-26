import React from "react";
import {PaginationProps} from "../../../interfaces.tsx";

const Pagination: React.FC<PaginationProps> = ({children}) => {
    return (

            <div className="pagination">
                {children}
            </div>
    );
};

export default Pagination;
