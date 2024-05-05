import {RemoveButtonProps} from "../../interfaces.tsx";

const EditButton: React.FC<RemoveButtonProps> = ({message, id, handleFunc}) => {
    return (
        <button className="editoutline--button" onClick={()=>handleFunc(id)} >
            {message}
        </button>
    );
};

export default EditButton;
