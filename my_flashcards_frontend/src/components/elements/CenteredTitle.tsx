import {CenteredTitleProps} from "../../interfaces.tsx";

const CenteredTitle: React.FC<CenteredTitleProps> = ({title}) => {
    return (
        <h1 className="account__title centered__title">{title}</h1>
    );
};

export default CenteredTitle;
