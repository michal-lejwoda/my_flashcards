import "../sass/navbar.css"
import {LANGUAGES} from "../constants/languages.tsx";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";

const Navbar = () => {
    const {i18n,t} = useTranslation();
    const onChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang_code = e.target.value;
        console.log("lang_code")
        console.log(lang_code)
        i18n.changeLanguage(lang_code);
    };

    return (
        <nav className="navbar__desktop desktop">
            <ul className="desktop__menu menu">
                <li className="menu__element"><NavLink to="/">{t("decks")}</NavLink></li>
                <li className="menu__element"><NavLink to="/search">{t("search")}</NavLink></li>
                <li className="menu__element"><NavLink to="/create">{t("create")}</NavLink></li>
                <li className="menu__element"><NavLink to="/add_file">{t("add_file")}</NavLink></li>
            </ul>
            <ul className="desktop__menu">
                <select  className="menu__language--select" defaultValue={i18n.language} onChange={onChangeLanguage}>
                    {LANGUAGES.map(({code, label}) => (
                        <option key={code} value={code}>
                            {label}
                        </option>
                    ))}
                </select>
                <li className="menu__element"><NavLink to="/account">{t("account")}</NavLink></li>
                <li className="menu__element"><NavLink to="/logout">{t("logout")}</NavLink></li>
                <li className="menu__element"><NavLink to="/login">{t("login")}</NavLink></li>
                <li className="menu__element"><NavLink to="/register">{t("register")}</NavLink></li>
            </ul>
        </nav>
    );
};

export default Navbar;
