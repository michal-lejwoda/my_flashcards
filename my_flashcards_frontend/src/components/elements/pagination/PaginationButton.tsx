import {PaginationButtonProps} from "../../../interfaces.tsx";
import {handleGoToUrl} from "../../../globalFunctions.tsx";


const PaginationButton = <T,>({ link, token, message, setData }: PaginationButtonProps<T>) => {
    return (
        <button
            className="pagination--button"
            onClick={() => handleGoToUrl(link, token, setData)}
        >
            {message}
        </button>
    );
};

export default PaginationButton;
