import {GreenButtonProps} from "../../interfaces.tsx";

const GreenButton: React.FC<GreenButtonProps> = ({message, onClick}) => {
    return (
        <button onClick={onClick && (() => onClick())} className="greenoutline--button" type="submit">
            {message}
        </button>
    );
};

export default GreenButton;
