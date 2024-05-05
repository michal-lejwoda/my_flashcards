import {PaginationButtonProps} from "../../../interfaces.tsx";
import {handleGoToUrl} from "../../../globalFunctions.tsx";
import React from "react";


const PaginationButton: React.FC<PaginationButtonProps> = ({link, token, message, setData}) => {
    return (
        <button className="pagination--button" onClick={() => handleGoToUrl(link, token, setData)}>{message}</button>
    );
};

export default PaginationButton;
