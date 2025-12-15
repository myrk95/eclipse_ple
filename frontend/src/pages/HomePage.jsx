import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './HomePage.css'; 

const HomePage = () => {

  return (
    <div className="home-page">
      <Navbar />
      
      <div className="home-container">
        {/* Encabezado principal */}
        <div className="home-header">
          <h1>Bienvenido a Eclipse</h1>
          <p className="home-subtitle">
            Detección temprana de cáncer de piel con inteligencia artificial
          </p>
        </div>

        {/* Contenido principal */}
        <div className="home-content">
          <h2>Tu salud dermatológica en buenas manos</h2>
          <p>
            Eclipse es una herramienta de análisis dermatológico que utiliza inteligencia 
            artificial para evaluar lesiones cutáneas y proporcionar un análisis preliminar 
            en cuestión de segundos.
          </p>
          
          <Link to="/scanner">
            <button className="home-btn-scan">
              <span>🚀</span>
              Comenzar Análisis
            </button>
          </Link>
        </div>

        {/* Sección de características */}
        <div className="features-section">
          <h2 className="features-title">¿Cómo funciona?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📸</span>
              <h3>Sube tu imagen</h3>
              <p>
                Captura una foto clara de la lesión cutánea que deseas analizar. 
                Asegúrate de tener buena iluminación.
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🤖</span>
              <h3>Análisis con IA</h3>
              <p>
                Nuestro modelo de inteligencia artificial analiza la imagen y 
                detecta patrones característicos.
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3>Obtén resultados</h3>
              <p>
                Recibe un análisis preliminar con nivel de riesgo, 
                recomendaciones y próximos pasos.
              </p>
            </div>
          </div>
        </div>

        {/* Sección de información */}
        <div className="info-section">
          <h3>Beneficios de usar Eclipse</h3>
          <ul>
            <li>Análisis en segundos</li>
            <li>Detección temprana de posibles anomalías</li>
            <li>Recomendaciones personalizadas según el resultado</li>
            <li>Historial de análisis para seguimiento</li>
            <li>Interfaz intuitiva y fácil de usar</li>
            <li>Accesible desde cualquier dispositivo</li>
          </ul>
          
          <div className="warning-box">
            <h4>⚠️ Importante</h4>
            <p>
              Eclipse proporciona análisis preliminares y <strong>NO sustituye </strong> 
              la consulta médica profesional. Siempre consulta a un dermatólogo 
              certificado para un diagnóstico definitivo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;