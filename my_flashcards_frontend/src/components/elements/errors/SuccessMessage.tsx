import {MessageProps} from "../../../interfaces.tsx";


const SuccessMessage: React.FC<MessageProps> = ({message}) => {
    return <p className="form__success form__message">{message}</p>;
};

export default SuccessMessage;
