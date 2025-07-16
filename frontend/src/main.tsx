// project\src\main.tsx (ou index.tsx, dependendo da sua configuração inicial do Vite/Create React App)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Mantenha esta importação para seus estilos Tailwind

// Importe os estilos do slick-carousel AQUI, antes de qualquer outro estilo.
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);