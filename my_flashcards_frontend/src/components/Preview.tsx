import {useTranslation} from "react-i18next";
import "../sass/preview.css"
import AsyncSelect from 'react-select/async';
import withAuth from "../context/withAuth.tsx";

const Preview = () => {
    const {t} = useTranslation();

    return (
        <section className="preview">
            <h1 className="title">{t('preview_deck')}</h1>
            <AsyncSelect cacheOptions defaultOptions/>
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
