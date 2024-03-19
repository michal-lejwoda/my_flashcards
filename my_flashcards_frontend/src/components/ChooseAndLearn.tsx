import "../sass/chooseandlearn.css"
import {useTranslation} from "react-i18next";
import AsyncSelect from "react-select/async";

const ChooseAndLearn = () => {
    const {t} = useTranslation();
    return (
        <div className="choose_and_learn">
            <h1 className="title">{t('learn_single_deck')}</h1>
            <AsyncSelect cacheOptions defaultOptions/>
            <div className="choose_and_learn__submit">
                <button className="greenoutline--button" type="submit">
                    {t("learn_single_deck")}
                </button>
                <button className="greenoutline--button" type="submit">
                    {t("add_to_list")}
                </button>
            </div>
            <table className="choose_and_learn__table">
                <thead>
                <tr>
                    <td>{t('deck')}</td>
                    <td>{t('number_of_words')}</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>res1</td>
                    <td>100</td>
                </tr>
                </tbody>
            </table>
            <div className="choose_and_learn__submit">
                <button className="greenoutline--button" type="submit">
                    {t("learn_more")}
                </button>
            </div>

        </div>
    );
};

export default ChooseAndLearn;
