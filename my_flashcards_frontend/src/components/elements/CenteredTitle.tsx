import {CenteredTitleProps} from "../../interfaces.tsx";

const CenteredTitle: React.FC<CenteredTitleProps> = ({title}) => {
    return (
        <h2 className="account__title centered__title">{title}</h2>
    );
};

export default CenteredTitle;
