import React from 'react';
import Topbar from "../components/Topbar/Topbar";
import TileContainer from "../components/Tile/TileContainer";
import Tile from "../components/Tile/Tile";
import { FaUsers, FaUserPlus, FaUsers as FaCommunity, FaPaw, FaGamepad } from "react-icons/fa";
import './Home.scss';

function Home() {
    return (
        <>
            <div className="home-page">
                <header className="home-header">
                    <h1>Panel Sterowania</h1>
                    <p>Witamy w centrum naszej społeczności fotograficznej! Wybierz jedną z opcji, aby rozpocząć.</p>
                </header>
                <TileContainer>
                    <Tile
                        title="Wyświetl użytkowników"
                        description="Przeglądaj listę wszystkich zarejestrowanych użytkowników."
                        IconComponent={FaUsers}
                        linkTo="/users"
                    />
                    <Tile
                        title="Dodaj użytkownika"
                        description="Utwórz nowego członka naszej społeczności."
                        IconComponent={FaUserPlus}
                        linkTo="/users/new"
                    />
                    <Tile
                        title="Społeczność"
                        description="Poznaj naszą fotograficzną społeczność i jej wartości."
                        IconComponent={FaCommunity}
                        linkTo="/accordion"
                    />
                    <Tile
                        title="Galeria Zwierząt"
                        description="Odkryj galerię zdjęć zwierząt z całego świata."
                        IconComponent={FaPaw}
                        linkTo="/carousel"
                    />
                    <Tile
                        title="Gra"
                        description="Sprawdź swoją wiedzę w naszej grze rozpoznawania zwierząt."
                        IconComponent={FaGamepad}
                        linkTo="/game"
                    />
                </TileContainer>
            </div>
        </>
    );
}

export default Home;