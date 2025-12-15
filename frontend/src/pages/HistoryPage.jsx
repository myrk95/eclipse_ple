import React from 'react';
import Navbar from '../components/Navbar';
import './ScannerPage.css';

const HistoryPage = () => {
  return (
    <div className="scanner-page">
      <Navbar />
      <div className="scanner-container">
        <div className="scanner-header">
          <h1>Historial de Escaneos</h1>
        </div>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h2>Página en desarrollo</h2>
          <p>Aquí se mostrarán tus escaneos anteriores cuando el backend esté listo.</p>
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h3>Próximamente:</h3>
            <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
              <li>Lista de escaneos anteriores</li>
              
              <li>Filtros por fecha y resultado</li>
              <li>Comparación de resultados</li>
              <li>Exportación de reportes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;