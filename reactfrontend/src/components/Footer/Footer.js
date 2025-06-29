import React from 'react';
import './Footer.scss';

const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            <span>© {new Date().getFullYear()} BBIU. Wszelkie prawa zastrzeżone.</span>
            <span className="separator">|</span>
            <a href="/accordion" className="footer-link">Społeczność</a>
            <span className="separator">|</span>
            <span>Kontakt: pomoc@bbiu.com</span>
        </div>
    </footer>
);

export default Footer;
