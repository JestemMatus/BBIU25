import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import './Tile.scss';

const Tile = ({ title, description, IconComponent, linkTo }) => (
    <div className="tile">
        <div className="tile-icon">
            {IconComponent && <IconComponent />}
        </div>
        <h3 className="tile-title">{title}</h3>
        <p className="tile-desc">{description}</p>
        {linkTo && (
            <a href={linkTo} className="tile-link">
                Przejdź dalej <FaChevronRight className="link-icon" />
            </a>
        )}
    </div>
);

export default Tile;