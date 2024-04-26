import React from "react";
import {PaginationNumberProps} from "../../../interfaces.tsx";
import {useTranslation} from "react-i18next";


const PaginationNumber: React.FC<PaginationNumberProps> = ({current_page, total_pages}) => {
    const {t} = useTranslation();
    return (
        <div className="pagination--number">{current_page} {t('of')} {total_pages}</div>
    );
};

export default PaginationNumber;
