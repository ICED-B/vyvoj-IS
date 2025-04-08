// Vstupní bod React aplikace

import React from 'react';
import ReactDOM from 'react-dom/client'; // Importujeme 'react-dom/client' pro React 18+
// import './index.css'; // Můžeme přidat základní CSS styly (nepovinné s Tailwindem)
import App from './App'; // Import hlavní komponenty aplikace
// import reportWebVitals from './reportWebVitals'; // Funkce pro měření výkonu

// Najdeme HTML element s ID 'root' v public/index.html
const rootElement = document.getElementById('root');
// Vytvoříme kořenový element Reactu pro tento HTML element
const root = ReactDOM.createRoot(rootElement);

// Vykreslíme hlavní komponentu <App /> do kořenového elementu
// <React.StrictMode> pomáhá odhalovat potenciální problémy v aplikaci
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Pokud chcete měřit výkon vaší aplikace, můžete použít reportWebVitals
// Například: reportWebVitals(console.log);
// Více informací: https://bit.ly/CRA-vitals
// reportWebVitals();

