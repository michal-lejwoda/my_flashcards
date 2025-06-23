import {RemoveButtonProps} from "../../interfaces.tsx";

const EditButton: React.FC<RemoveButtonProps> = ({message, id, handleFunc}) => {
    return (
        <button className="greenoutline--button greenoutline--button--mb" onClick={()=>handleFunc(id)} >
            {message}
        </button>
    );
};

export default EditButton;
