import {useTranslation} from "react-i18next";
import "../sass/preview.css"
import AsyncSelect from 'react-select/async';
import withAuth from "../context/withAuth.tsx";
import {getDecks} from "../api.tsx";
import {DecksTable} from "../interfaces.tsx";
import {useContext, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";

const Preview = () => {
    const {t} = useTranslation();
    const {token} = useContext(AuthContext);
    const [deck, setDeck] = useState<DecksTable | null>(null)
    const promiseOptions = async (inputValue: string) => {
        const result = await getDecks(token, inputValue, 10)
        return result.results
    }
    const customGetOptionLabel = (option: DecksTable) => option.name;

    const customGetOptionValue = (option: DecksTable) => option.id.toString();

    const handleChange = (newValue: DecksTable | null) => {
        setDeck(newValue);
    };

    return (
        <section className="preview">
            <h1 className="title">{t('preview_deck')}</h1>
            <AsyncSelect
                cacheOptions
                defaultOptions
                value={deck}
                onChange={handleChange}
                loadOptions={promiseOptions}
                getOptionLabel={customGetOptionLabel}
                getOptionValue={customGetOptionValue}
            />
            <div className="preview__middle">
                <h1>{t('preview')}</h1>
                <div className="preview__buttons">
                    <button className="standard-button">{t('learn')}</button>
                    <input className="preview__search" placeholder={t("filter")} type="text"/>
                </div>
            </div>
            <div className="preview__table">
                <table>
                    <thead>
                    <tr>
                        <th>
                            {t('front_page')}
                        </th>
                        <th>
                            {t('reverse_page')}
                        </th>
                        <th>
                            {t('actions')}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>pies</td>
                        <td>dog</td>
                        <td><button>{t('actions')}</button></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default withAuth(Preview);
