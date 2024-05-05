import {MessageProps} from "../../../interfaces.tsx";


const ErrorMessage: React.FC<MessageProps> = ({message}) => {
    return <p className="form__error form__message">{message}</p>;
};

export default ErrorMessage;
