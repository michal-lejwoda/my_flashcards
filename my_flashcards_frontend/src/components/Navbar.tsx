import "../sass/navbar.css"
const Navbar = () => {
    return (
        <nav className="navbar__desktop desktop">
            <ul className="desktop__menu menu">
                <li className="menu__element"><a href="/">Talie</a></li>
                <li className="menu__element"><a href="/search">Szukaj</a></li>
                <li className="menu__element"><a href="/create">Stwórz</a></li>
                <li className="menu__element"><a href="/add_file">Dodaj plik</a></li>
            </ul>
            <ul className="desktop__menu">
                <li className="menu__element">Flaga</li>
                <li className="menu__element"><a href="/account">Konto</a></li>
                <li className="menu__element"><a href="/login">Wyloguj się</a></li>
                <li className="menu__element"><a href="/login">Zaloguj się</a></li>
                <li className="menu__element"><a href="/register">Zarejestruj się</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
