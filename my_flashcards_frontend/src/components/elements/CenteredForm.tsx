import React from "react";
import {CenteredFormProps} from "../../interfaces.tsx";

const CenteredForm: React.FC<CenteredFormProps> = ({handleSubmit, children}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className="change_password__form centered__form">
                {children}
            </div>
        </form>
    );
};

export default CenteredForm;
