import {BackendMessageProps} from "../../../interfaces.tsx";
import React from "react";

const BackendErrorMessage: React.FC<BackendMessageProps> = ({message}) => {
    return <p className="form__error form__message">{message}</p>;
};

export default BackendErrorMessage;
