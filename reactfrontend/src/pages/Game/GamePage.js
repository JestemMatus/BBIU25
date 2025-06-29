import React, { useState, useEffect, useRef } from 'react';
import './GamePage.scss';

import elephantImg from '../../assets/elephant.jpg';
import tigerImg    from '../../assets/tiger.jpg';
import giraffeImg  from '../../assets/giraffe.jpg';
import lionImg     from '../../assets/lion.jpg';
import zebraImg    from '../../assets/zebra.jpg';
import pandaImg    from '../../assets/panda.jpg';
import penguinImg  from '../../assets/penguin.jpg';
import koalaImg    from '../../assets/koala.jpg';
import monkeyImg   from '../../assets/monkey.jpg';
import foxImg      from '../../assets/fox.jpg';
import owlImg      from '../../assets/owl.jpg';
import bearImg     from '../../assets/bear.jpg';
import deerImg     from '../../assets/deer.jpg';
import rabbitImg   from '../../assets/rabbit.jpg';
import horseImg    from '../../assets/horse.jpg';
import frogImg     from '../../assets/frog.jpg';

const animalData = [
    { name: 'Słoń', img: elephantImg },
    { name: 'Tygrys', img: tigerImg },
    { name: 'Żyrafa', img: giraffeImg },
    { name: 'Lew', img: lionImg },
    { name: 'Zebra', img: zebraImg },
    { name: 'Panda', img: pandaImg },
    { name: 'Pingwin', img: penguinImg },
    { name: 'Koala', img: koalaImg },
    { name: 'Małpa', img: monkeyImg },
    { name: 'Lis', img: foxImg },
    { name: 'Sowa', img: owlImg },
    { name: 'Niedźwiedź', img: bearImg },
    { name: 'Jeleń', img: deerImg },
    { name: 'Królik', img: rabbitImg },
    { name: 'Koń', img: horseImg },
    { name: 'Żaba', img: frogImg }
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const formatTime = sec =>
    `${String(Math.floor(sec / 60)).padStart(2,'0')}:${String(sec % 60).padStart(2,'0')}`;

const GamePage = () => {
    const [phase, setPhase] = useState('start');
    const [tiles, setTiles] = useState([]);
    const [countdown, setCountdown] = useState(5);
    const [target, setTarget] = useState(null);
    const [score, setScore] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [targetAssignedAt, setTargetAssignedAt] = useState(null);

    const timerRef = useRef(null);
    const penalty = 1;

    const fetchRecords = () => {
        fetch('http://localhost:8082/records')
            .then(res => res.json())
            .then(data => {
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data.Sukces)
                        ? data.Sukces
                        : [];
                setLeaderboard(list);
            })
            .catch(console.error);
    };

    useEffect(() => {
        if (phase === 'start') fetchRecords();
    }, [phase]);

    const preloadImages = () =>
        Promise.all(
            animalData.map(a =>
                new Promise((res, rej) => {
                    const img = new Image();
                    img.src = a.img;
                    img.onload = res;
                    img.onerror = rej;
                })
            )
        );

    const prepareTiles = () =>
        setTiles(
            shuffle(animalData).map((a, i) => ({
                id: i,
                ...a,
                revealed: true,
                matched: false
            }))
        );

    const startGame = () => {
        setPhase('loading');
        preloadImages().finally(() => {
            prepareTiles();
            setScore(0);
            setElapsed(0);
            setCountdown(5);
            setPhase('memorize');
        });
    };

    useEffect(() => {
        if (phase !== 'memorize') return;
        if (countdown > 0) {
            const t = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(t);
        }
        setTiles(prev => prev.map(t => ({ ...t, revealed: false })));
        setPhase('guess');
    }, [phase, countdown]);

    useEffect(() => {
        if (phase === 'guess') {
            timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
            const rem = tiles.filter(t => !t.matched);
            setTarget(rem[Math.floor(Math.random() * rem.length)]);
        }
        return () => clearInterval(timerRef.current);
    }, [phase]);

    useEffect(() => {
        if (!showSuccess) return;
        const t = setTimeout(() => setShowSuccess(false), 4000);
        return () => clearTimeout(t);
    }, [showSuccess]);

    const saveRecord = () => {
        fetch(
            `http://localhost:8082/records?player=${encodeURIComponent(playerName)}&score=${score}`,
            {
                method: 'POST',
            }
        )
            .then(res => {
                if (!res.ok) throw new Error(`Server zwrócił ${res.status}`);
                return res.json();
            })
            .then(() => {
                fetchRecords();
                setPhase('start');
            })
            .catch(err => console.error('Error saving record:', err));
    };

    const handleCorrectMatch = id => {
        setTiles(prev => {
            const updated = prev.map(t => t.id === id ? { ...t, matched: true } : t);
            const remaining = updated.filter(t => !t.matched);
            if (!remaining.length) {
                setPhase('end');
                setShowSuccess(true);
            } else {
                setTarget(remaining[Math.floor(Math.random() * remaining.length)]);
            }
            return updated;
        });
        setScore(s => s + 10);
    };
    const handleClick = tile => {
        if (phase !== 'guess' || tile.revealed || tile.matched) return;
        setTiles(prev =>
            prev.map(t =>
                t.id === tile.id ? { ...t, revealed: true } : t
            )
        );
        if (tile.name === target.name) {
            setTimeout(() => handleCorrectMatch(tile.id), 400);
        } else {
            setTimeout(() => {
                setTiles(prev =>
                    prev.map(t =>
                        t.id === tile.id ? { ...t, revealed: false } : t
                    )
                );
                setScore(s => Math.max(0, s - penalty));
            }, 800);
        }
    };

    return (
        <div className="ag-game-page">
            {phase === 'start' && (
                <div className="overlay game-overlay">
                    <h1 className="title">Zapamiętuj zwierzęta</h1>
                    <button className="btn-game" onClick={startGame}>
                        Start
                    </button>
                    <div className="instructions">
                        <p>
                            Po kliknięciu „Start” plansza pojawi się na 5 sekund –
                            zapamiętaj jak najwięcej zwierząt.
                        </p>
                        <p>
                            Następnie wskazuj zwierzę, którego nazwa pojawi się w
                            panelu bocznym.
                        </p>
                        <p>Poprawne trafienie +10 pkt, błędne -5 pkt.</p>
                    </div>
                </div>
            )}

            {phase === 'loading' && (
                <div className="overlay game-overlay">
                    <h2>Ładowanie…</h2>
                    <p>Proszę czekać, trwa ładowanie obrazków.</p>
                </div>
            )}

            {showSuccess && (
                <div className="toast success-toast">
                    🎉 Gratulacje! Ukończyłeś grę!
                </div>
            )}

            {phase === 'end' && (
                <div className="overlay game-overlay">
                    <h2>Gratulacje!</h2>
                    <p>Wynik: <strong>{score}</strong></p>
                    <p>Czas: <strong>{formatTime(elapsed)}</strong></p>
                    <input
                        type="text"
                        placeholder="Twoja nazwa"
                        value={playerName}
                        onChange={e => setPlayerName(e.target.value)}
                    />
                    <button
                        className="btn-game"
                        disabled={!playerName.trim()}
                        onClick={saveRecord}
                    >
                        Zapisz wynik
                    </button>
                </div>
            )}

            {(phase === 'memorize' || phase === 'guess') && (
                <div className="ag-wrapper">
                    <section className="ag-board">
                        <div className="ag-grid">
                            {tiles.map(tile => (
                                <div
                                    key={tile.id}
                                    className={`ag-tile ${
                                        tile.revealed ? 'revealed' : ''
                                    } ${tile.matched ? 'matched' : ''}`}
                                    onClick={() => handleClick(tile)}
                                >
                                    <div className="inner">
                                        <div className="front" />
                                        <div
                                            className="back"
                                            style={{ backgroundImage: `url(${tile.img})` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <aside className="ag-sidebar">
                        {phase === 'memorize' && (
                            <div className="sidebar-section memorize">
                                <span className="label">Zapamiętaj w:</span>
                                <span className="value">{countdown}</span>
                            </div>
                        )}
                        {phase === 'guess' && target && (
                            <div className="sidebar-section target">
                                <span className="label">Znajdź:</span>
                                <span className="value">{target.name}</span>
                            </div>
                        )}
                        <div className="sidebar-section score">
                            <span className="label">Wynik:</span>
                            <span className="value">{score}</span>
                        </div>
                        <div className="sidebar-section timer">
                            <span className="label">⏱ Czas:</span>
                            <span className="value">{formatTime(elapsed)}</span>
                        </div>
                        <div className="leader-card">
                            <h3>🏆 Ranking</h3>
                            <ol>
                                {leaderboard.map((r, i) => (
                                    <li key={r.id} className="leader-item">
                                        <span className="rank">{i + 1}.</span>
                                        <span className="leader-name">{r.name}</span>
                                        <span className="leader-score">{r.points}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default GamePage;
