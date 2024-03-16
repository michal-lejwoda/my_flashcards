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
    };

    return (
        <nav>
            <div className="navbar__desktop desktop">
                <ul className="desktop__menu menu">
                    <li className="menu__element navbar__item"><NavLink to="/">{t("decks")}</NavLink></li>
                    <li className="menu__element navbar__item"><NavLink to="/search">{t("search")}</NavLink></li>
                    <li className="menu__element navbar__item"><NavLink to="/create">{t("create")}</NavLink></li>
                    <li className="menu__element navbar__item"><NavLink to="/add_file">{t("add_file")}</NavLink></li>
                </ul>
                <ul className="desktop__menu">
                    <select className="menu__language--select" value={language} onChange={onChangeLanguage}>
                        {LANGUAGES.map(({code, label}) => (
                            <option key={code} value={code}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <li className="menu__element navbar__item"><NavLink to="/account">{t("account")}</NavLink></li>
                    <li className="menu__element navbar__item"><NavLink to="/logout">{t("logout")}</NavLink></li>
                    <li className="menu__element navbar__item"><NavLink to="/login">{t("login")}</NavLink></li>
                    <li className="menu__element navbar__item"><NavLink to="/register">{t("register")}</NavLink></li>
                </ul>
            </div>
            <div className="navbar__mobile mobile">
                <div className="mobile__toggle" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}><FontAwesomeIcon
                    size="2x" icon={faBars}/></div>
                <select className="mobile__language--select" value={language} onChange={onChangeLanguage}>
                    {LANGUAGES.map(({code, label}) => (
                        <option key={code} value={code}>
                            {label}
                        </option>
                    ))}
                </select>
                <ul className="mobile__menu" style={{display: isMobileNavOpen ? 'flex' : 'none'}}>
                    <li className="mobile__menu__element navbar__item"><NavLink onClick={()=>setIsMobileNavOpen(false)} to="/">{t("decks")}</NavLink></li>
                    <li className="mobile__menu__element navbar__item"><NavLink onClick={()=>setIsMobileNavOpen(false)} to="/search">{t("search")}</NavLink></li>
                    <li className="mobile__menu__element navbar__item"><NavLink onClick={()=>setIsMobileNavOpen(false)} to="/create">{t("create")}</NavLink></li>
                    <li className="mobile__menu__element navbar__item"><NavLink onClick={()=>setIsMobileNavOpen(false)} to="/add_file">{t("add_file")}</NavLink></li>
                </ul>


            </div>
        </nav>
    );
};

export default Navbar;
