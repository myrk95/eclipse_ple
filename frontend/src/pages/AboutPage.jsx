import Navbar from '../components/Navbar';
import './ScannerPage.css';

const AboutPage = () => {
  return (
    <div className="scanner-page">
      <Navbar />
      <div className="scanner-container">
        <div className="scanner-header">
          <h1>Acerca de ECLIPSE</h1>
          <p className="subtitle">Tecnología al servicio de tu salud</p>
        </div>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>Sobre el Proyecto</h2>
            <p style={{ margin: '1rem 0', lineHeight: '1.6' }}>
              SkinScan AI es una aplicación web que utiliza inteligencia artificial para el análisis 
              preliminar de lesiones cutáneas. Nuestro objetivo es facilitar la detección temprana 
              de posibles problemas en la piel.
            </p>
            
            <h3 style={{ marginTop: '2rem' }}>Características:</h3>
            <ul style={{ marginLeft: '1.5rem', marginTop: '1rem', lineHeight: '1.6' }}>
              <li>Análisis de imágenes con modelos de IA especializados</li>
              <li>Resultados preliminares en segundos</li>
              <li>Recomendaciones personalizadas</li>
              <li>Historial de análisis</li>
              <li>Interfaz intuitiva y fácil de usar</li>
            </ul>
            
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#e3f2fd', borderRadius: '8px' }}>
              <h4>⚠️ Importante:</h4>
              <p>
                Esta aplicación proporciona análisis preliminares y <strong>NO sustituye</strong> 
                la consulta con un dermatólogo certificado. Los resultados deben ser validados 
                por un profesional médico.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;