import {GreenButtonProps} from "../../interfaces.tsx";

const GreenButton: React.FC<GreenButtonProps> = ({message}) => {
    return (
        <button className="greenoutline--button" type="submit">
            {message}
        </button>
    );
};

export default GreenButton;
