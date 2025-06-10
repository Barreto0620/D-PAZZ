// project\src\main.tsx (ou index.tsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Mantenha esta importação

// Importe os estilos do slick-carousel AQUI, antes de qualquer outro estilo.
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);