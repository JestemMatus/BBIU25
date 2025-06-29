import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Topbar from './components/Topbar/Topbar';
import Footer from './components/Footer/Footer';
import './App.css';

import Home from './pages/Home';
import UsersListPage from "./pages/Users/Users";
import UserFormPage from "./pages/UsersForm/UserFormPage";
import AccordionPage from "./pages/Accordion/AccordionPage";
import CarouselPage from "./pages/Carousel/CarouselPage";
import GamePage from "./pages/Game/GamePage";


function App() {
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <Router>
            <div className={theme}>
                <Topbar theme={theme} toggleTheme={toggleTheme} />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/users" element={<UsersListPage theme={theme} toggleTheme={toggleTheme} />} />
                    <Route path="/users/new" element={<UserFormPage />} />
                    <Route path="/users/edit/:id" element={<UserFormPage />} />
                    <Route path="/accordion" element={<AccordionPage />} />
                    <Route path="/carousel" element={<CarouselPage />} />
                    <Route path="/game" element={<GamePage />} />


                </Routes>

                <Footer />
            </div>
        </Router>
    );
}

export default App;
