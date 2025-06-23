import {RemoveButtonProps} from "../../interfaces.tsx";

const RemoveButton: React.FC<RemoveButtonProps> = ({message, id, handleFunc}) => {
    return (
        <button className="greenoutline--button greenoutline--button--mb" onClick={()=>handleFunc(id)} >
            {message}
        </button>
    );
};

export default RemoveButton;
