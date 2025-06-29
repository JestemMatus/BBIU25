import React, { useState, useEffect, useRef } from 'react';
import './CarouselPage.scss';

import slide1 from '../../assets/slide1.jpg';
import slide2 from '../../assets/slide2.jpg';
import slide3 from '../../assets/slide3.jpg';
import slide4 from '../../assets/slide4.jpg';
import slide5 from '../../assets/bear.jpg';


const images = [ slide1, slide2, slide3, slide4, slide5 ];

const CarouselPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const total = images.length;
    const intervalRef = useRef(null);

    const handleNext = () => {
        setCurrentIndex(i => (i + 1) % total);
    };

    const handlePrev = () => {
        setCurrentIndex(i => (i - 1 + total) % total);
    };

    useEffect(() => {
        startAutoplay();
        return stopAutoplay;
    }, []);

    const startAutoplay = () => {
        stopAutoplay();
        intervalRef.current = setInterval(handleNext, 5000);
    };

    const stopAutoplay = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    return (
        <div
            className="carousel-page"
            onMouseEnter={stopAutoplay}
            onMouseLeave={startAutoplay}
        >
            <h1>Zwierzęta świata</h1>
            <div className="carousel-wrapper">
                <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((src, idx) => (
                        <div
                            key={idx}
                            className={`carousel-slide ${idx === currentIndex ? 'active' : ''}`}
                        >
                            <img
                                className="carousel-image"
                                src={src}
                                alt={`Slide ${idx + 1}`}
                            />
                        </div>
                    ))}
                </div>

                <button className="carousel-nav carousel-nav--prev" onClick={handlePrev}>
                    ‹
                </button>
                <button className="carousel-nav carousel-nav--next" onClick={handleNext}>
                    ›
                </button>
            </div>

            <div className="carousel-dots">
                {images.map((_, idx) => (
                    <span
                        key={idx}
                        className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(idx)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CarouselPage;