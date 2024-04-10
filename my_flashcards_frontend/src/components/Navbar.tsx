import "../sass/navbar.css"
import {LANGUAGES} from "../constants/languages.tsx";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";

const Navbar = () => {
    const {i18n, t} = useTranslation();
    const [language, setLanguage] = useState(i18n.language)
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const onChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang_code = e.target.value;
        setLanguage(e.target.value)
        i18n.changeLanguage(lang_code);
        // setYupLanguageChange(e.target.value)
    };

    return (
        <nav>
            <div className="navbar__desktop desktop">
                <ul className="desktop__menu menu">
                    <NavLink to="/" className="navbar__item">
                        <li className="menu__element">{t("decks")}</li>
                    </NavLink>
                    <NavLink to="/search" className="navbar__item">
                        <li className="menu__element">{t("search")}</li>
                    </NavLink>
                    <NavLink to="/create" className="navbar__item">
                        <li className="menu__element">{t("create")}</li>
                    </NavLink>
                    <NavLink to="/add_file" className="navbar__item">
                        <li className="menu__element">{t("add_file")}</li>
                    </NavLink>
                </ul>
                <ul className="desktop__menu">
                    <select className="menu__language--select navbar__select" value={language}
                            onChange={onChangeLanguage}>
                        {LANGUAGES.map(({code, label}) => (
                            <option key={code} value={code}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <NavLink to="/account" className="navbar__item">
                        <li className="menu__element ">{t("account")}</li>
                    </NavLink>
                    <NavLink to="/logout" className="navbar__item">
                        <li className="menu__element">{t("logout")}</li>
                    </NavLink>
                    <NavLink to="/login" className="navbar__item">
                        <li className="menu__element">{t("login")}</li>
                    </NavLink>
                    <NavLink to="/register" className="navbar__item">
                        <li className="menu__element">{t("register")}</li>
                    </NavLink>
                </ul>
            </div>
            <div className="navbar__mobile mobile">
                <div className="mobile__toggle" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}><FontAwesomeIcon
                    size="2x" icon={faBars}/></div>
                <select className="mobile__language--select navbar__select" value={language}
                        onChange={onChangeLanguage}>
                    {LANGUAGES.map(({code, label}) => (
                        <option key={code} value={code}>
                            {label}
                        </option>
                    ))}
                </select>
                <ul className="mobile__menu" style={{display: isMobileNavOpen ? 'flex' : 'none'}}>
                    <NavLink className="navbar__item" onClick={() => setIsMobileNavOpen(false)} to="/">
                        <li className="mobile__menu__element ">{t("decks")}</li>
                    </NavLink>
                    <NavLink className="navbar__item" onClick={() => setIsMobileNavOpen(false)} to="/search">
                        <li className="mobile__menu__element">{t("search")}</li>
                    </NavLink>
                    <NavLink className="navbar__item" onClick={() => setIsMobileNavOpen(false)} to="/create">
                        <li className="mobile__menu__element">{t("create")}</li>
                    </NavLink>
                    <NavLink className="navbar__item" onClick={() => setIsMobileNavOpen(false)} to="/add_file">
                        <li className="mobile__menu__element">{t("add_file")}</li>
                    </NavLink>
                </ul>


            </div>
        </nav>
    );
};

export default Navbar;
