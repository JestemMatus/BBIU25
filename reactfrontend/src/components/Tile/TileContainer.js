import React from 'react';
import Tile from './Tile';
import './TileContainer.scss';

const TileContainer = ({ children }) => (
    <div className="tile-container">
        {children}
    </div>
);

export default TileContainer;