import React from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import './Topbar.scss';

const Topbar = ({ theme, toggleTheme }) => (
    <header className="topbar">
        <div className="logo">
            <Link to="/">BBIU</Link>
        </div>
        <nav className="nav">
            <Link to="/users">Użytkownicy</Link>
            <Link to="/users/new">Dodaj użytkownika</Link>
            <Link to="/carousel">Galeria</Link>
            <Link to="/accordion">Społeczność</Link>
            <Link to="/game">Gra</Link>
        </nav>
        <button className="themeToggle" onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
    </header>
);

export default Topbar;