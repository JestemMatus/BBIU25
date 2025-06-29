import React, { useState, useRef, useEffect } from 'react';
import './AccordionPage.scss';

const panelsData = [
    {
        id: 1,
        title: 'O nas',
        content: `Jesteśmy stroną zrzeszającą fanatyków fotografii z całego świata. Nasza społeczność skupia zarówno amatorów, jak i profesjonalistów, którzy dzielą się wiedzą, inspirują nawzajem i wspólnie eksplorują nowe techniki.`
    },
    {
        id: 2,
        title: 'Nasza misja',
        content: `Celem naszej platformy jest rozwój pasji fotograficznej, promowanie kreatywności i budowanie sieci wsparcia dla wszystkich miłośników uchwycenia piękna w kadrze. Chcemy, aby każdy uczestnik czuł się zmotywowany do dalszego rozwoju.`
    },
    {
        id: 3,
        title: 'Wartości',
        content: `Wierzymy w otwartość, wzajemny szacunek i ciągłe doskonalenie. Doceniamy oryginalność, wspieramy etyczne podejście do fotografii i promujemy działania przyjazne środowisku.`
    }
];

const AccordionPanel = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef(null);
    const [height, setHeight] = useState('0px');

    useEffect(() => {
        if (contentRef.current) {
            setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
        }
    }, [isOpen]);

    return (
        <div className={`accordion-panel ${isOpen ? 'open' : ''}`}>
            <button
                className="accordion-header"
                onClick={() => setIsOpen(o => !o)}
            >
                <span>{title}</span>
                <span className={`accordion-icon ${isOpen ? 'rotated' : ''}`}>▶</span>
            </button>
            <div
                ref={contentRef}
                className="accordion-content"
                style={{ maxHeight: height }}
            >
                <p>{content}</p>
            </div>
        </div>
    );
};

const AccordionPage = () => (
    <div className="accordion-page">
        <h1>Nasza społeczność</h1>
        {panelsData.map(panel => (
            <AccordionPanel
                key={panel.id}
                title={panel.title}
                content={panel.content}
            />
        ))}
    </div>
);

export default AccordionPage;