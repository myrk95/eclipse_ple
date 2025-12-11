import React, { useState, useRef } from 'react';
import './ScannerPage.css';
import Navbar from '../components/Navbar';
import scannerService from '../services/scannerService';

const ScannerPage = () => {
  // Estados principales
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  
  // Estados para manejo de errores y progreso
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Referencias
  const fileInputRef = useRef(null);

  // Validación de archivo
  const validateFile = (file) => {
    return scannerService.validateFile(file);
  };

  // Manejo de subida de imagen
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      validateFile(file);
      
      setSelectedImage(file);
      setError(null);
      setScanResults(null);
      setUploadProgress(0);
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
    } catch (err) {
      setError(err.message);
      event.target.value = '';
    }
  };

  // Manejo de arrastrar y soltar
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        validateFile(file);
        
        setSelectedImage(file);
        setError(null);
        setScanResults(null);
        setUploadProgress(0);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
        
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError('Por favor, arrastra solo archivos de imagen.');
    }
  };

  // Disparar el input file
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Limpiar imagen
  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setScanResults(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Función principal para analizar imagen
  const handleScanClick = async () => {
    if (!selectedImage) {
      setError('Por favor, selecciona una imagen primero');
      return;
    }

    setIsScanning(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Usar el servicio para analizar la imagen
      const backendData = await scannerService.analyzeImage(
        selectedImage, 
        (percentCompleted) => setUploadProgress(percentCompleted)
      );

      // Procesar la respuesta del backend usando el servicio
      const processedResults = scannerService.processBackendResponse(backendData);
      setScanResults(processedResults);
      
      // Guardar en historial local
      saveToHistory(processedResults);

    } catch (err) {
      console.error('Error al procesar la imagen:', err);
      
      // Manejar errores
      let errorMessage = `Error: ${err.message}`;
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Tiempo de espera agotado. El servidor está tardando demasiado.';
      } else if (err.message.includes('NetworkError')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8000';
      }
      
      setError(errorMessage);
      
      // Para desarrollo: mostrar datos de ejemplo
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          setError(`${err.message}. Mostrando resultados de ejemplo para desarrollo.`);
          showFallbackResults();
        }, 1000);
      }
      
    } finally {
      setIsScanning(false);
    }
  };

  // Función de fallback para desarrollo
  const showFallbackResults = () => {
    const fallbackData = {
      status: "ok",
      resultado: Math.random() > 0.7 ? "MALIGNO" : "BENIGNO",
      probabilidad: (Math.random() * 100).toFixed(2) + "%"
    };
    
    const processedResults = scannerService.processBackendResponse(fallbackData);
    setScanResults(processedResults);
    saveToHistory(processedResults);
  };

  // Guardar en historial local
  const saveToHistory = (result) => {
    try {
      const history = JSON.parse(localStorage.getItem('eclipseScanHistory') || '[]');
      const historyItem = {
        ...result,
        imagePreview: previewUrl,
        date: new Date().toISOString(),
        saved: true
      };
      
      history.unshift(historyItem);
      localStorage.setItem('eclipseScanHistory', JSON.stringify(history.slice(0, 50)));
    } catch (err) {
      console.error('Error guardando en historial:', err);
    }
  };

  // Obtener color según nivel de riesgo
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'BAJO': return '#2ecc71';
      case 'MEDIO': return '#f39c12';
      case 'ALTO': return '#e74c3c';
      default: return '#3498db';
    }
  };

  // Obtener icono según nivel de riesgo
  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'BAJO': return '✅';
      case 'MEDIO': return '⚠️';
      case 'ALTO': return '🚨';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="scanner-page">
      {/* ¡ESTA ES LA PARTE QUE FALTABA! */}
      <Navbar />
      
      <div className="scanner-container">
        {/* Encabezado */}
        <div className="scanner-header">
          <h1>Escáner de Piel</h1>
          <p className="subtitle">
            Sube una foto de tu piel para un análisis con IA
          </p>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="error-message">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
            <button 
              className="error-close"
              onClick={() => setError(null)}
              aria-label="Cerrar mensaje de error"
            >
              ×
            </button>
          </div>
        )}

        {/* Contenido principal */}
        <div className="scanner-content">
          {/* Panel izquierdo: Subida de imagen */}
          <div className="upload-panel">
            <div 
              className={`image-upload-area ${isDragging ? 'drag-over' : ''} ${previewUrl ? 'has-image' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={previewUrl ? null : triggerFileInput}
              aria-label="Área para subir imagen"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && triggerFileInput()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
                aria-label="Seleccionar archivo de imagen"
              />
              
              {previewUrl ? (
                <div className="image-preview">
                  <img 
                    src={previewUrl} 
                    alt="Vista previa de la imagen a analizar" 
                    onError={() => setError('Error al cargar la imagen')}
                  />
                  <div className="image-overlay">
                    <button 
                      className="btn-change-image"
                      onClick={triggerFileInput}
                      aria-label="Cambiar imagen"
                    >
                      📁 Cambiar imagen
                    </button>
                    <button 
                      className="btn-remove-image"
                      onClick={clearImage}
                      aria-label="Eliminar imagen"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="upload-icon">
                    <span className="icon" role="img" aria-label="Cámara">📷</span>
                  </div>
                  <p className="upload-text">
                    {isDragging ? '¡Suelta la imagen aquí!' : 'Arrastra y suelta una imagen aquí'}
                    <br />
                    o haz clic para seleccionar
                  </p>
                  <p className="upload-hint">
                    Formatos soportados: JPG, PNG, GIF, WebP, BMP
                    <br />
                    Tamaño máximo: 10MB
                  </p>
                </>
              )}
            </div>

            {/* Barra de progreso */}
            {isScanning && (
              <div className="upload-progress">
                <div className="progress-header">
                  <span>Progreso del análisis</span>
                  <span className="progress-percent">{uploadProgress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                    role="progressbar"
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="progress-steps">
                  <span className={`step ${uploadProgress >= 25 ? 'active' : ''}`}>Subiendo</span>
                  <span className={`step ${uploadProgress >= 50 ? 'active' : ''}`}>Procesando</span>
                  <span className={`step ${uploadProgress >= 75 ? 'active' : ''}`}>Analizando</span>
                  <span className={`step ${uploadProgress >= 100 ? 'active' : ''}`}>Completado</span>
                </div>
              </div>
            )}

            {/* Controles */}
            <div className="scan-controls">
              <button 
                className={`btn-scan ${!selectedImage || isScanning ? 'disabled' : ''}`}
                onClick={handleScanClick}
                disabled={!selectedImage || isScanning}
                aria-label="Iniciar escaneo de imagen"
              >
                {isScanning ? (
                  <>
                    <span className="spinner" aria-hidden="true"></span>
                    {uploadProgress < 100 ? 'Enviando al servidor...' : 'Procesando...'}
                  </>
                ) : (
                  <>
                    <span className="scan-icon" role="img" aria-label="Microscopio">🔬</span>
                    ANALIZAR CON IA
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Panel derecho: Resultados */}
          <div className="results-panel">
            <div className="results-header">
              <h2>Resultados del Análisis</h2>
              <div className="results-status">
                {isScanning ? (
                  <span className="status scanning" role="status">
                    🔍 Conectando con Django Backend...
                  </span>
                ) : scanResults ? (
                  <span className="status complete" role="status">
                    ✅ Análisis completado
                  </span>
                ) : (
                  <span className="status pending" role="status">
                    📭 Sube una imagen para analizar
                  </span>
                )}
              </div>
            </div>

            <div className="results-content">
              {isScanning ? (
                <div className="scanning-animation">
                  <div className="pulse" aria-hidden="true"></div>
                  <h3>Procesando imagen con IA...</h3>
                  <p>El servidor Django está analizando tu imagen</p>
                </div>
              ) : scanResults ? (
                <>
                  {/* Tarjeta de diagnóstico */}
                  <div 
                    className={`diagnosis-card ${scanResults.riskLevel.toLowerCase()}`}
                    style={{ borderColor: getRiskColor(scanResults.riskLevel) }}
                  >
                    <div className="diagnosis-header">
                      <div>
                        <h3>Resultado del Análisis</h3>
                        <small className="scan-id">ID: {scanResults.scanId}</small>
                      </div>
                      <div className="risk-indicator">
                        <span 
                          className={`risk-badge ${scanResults.riskLevel.toLowerCase()}`}
                          style={{ backgroundColor: getRiskColor(scanResults.riskLevel) }}
                        >
                          {getRiskIcon(scanResults.riskLevel)} {scanResults.riskLevel}
                        </span>
                      </div>
                    </div>
                    
                    <div className="diagnosis-main">
                      <h2 className="diagnosis-text">
                        {scanResults.diagnosis}
                        <span className="malignancy-indicator">
                          {scanResults.isMalignant ? ' (Maligno)' : ' (Benigno)'}
                        </span>
                      </h2>
                      
                      {/* Probabilidad */}
                      {scanResults.melanomaProbability !== undefined && (
                        <div className="probability-display">
                          <h4>Probabilidad de malignidad:</h4>
                          <div className="probability-value">
                            {(scanResults.melanomaProbability * 100).toFixed(2)}%
                          </div>
                          <div className="probability-bar">
                            <div 
                              className="probability-fill"
                              style={{ 
                                width: `${scanResults.melanomaProbability * 100}%`,
                                backgroundColor: getRiskColor(scanResults.riskLevel)
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="diagnosis-details">
                      {/* Descripción */}
                      {scanResults.description && (
                        <div className="description-section">
                          <h4>📋 Descripción</h4>
                          <p>{scanResults.description}</p>
                        </div>
                      )}
                      
                      {/* Recomendaciones */}
                      {scanResults.recommendations && scanResults.recommendations.length > 0 && (
                        <div className="recommendations-section">
                          <h4>📝 Recomendaciones</h4>
                          <ul className="recommendations-list">
                            {scanResults.recommendations.map((rec, index) => (
                              <li key={index} className="recommendation-item">
                                <span className="rec-number">{index + 1}.</span>
                                <span className="rec-text">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Metadatos */}
                      <div className="results-meta">
                        <div className="meta-item">
                          <span className="meta-icon">📅</span>
                          <span className="meta-text">Analizado: {scanResults.timestamp}</span>
                        </div>
                        
                        <div className="disclaimer-warning">
                          <span className="warning-icon">⚠️</span>
                          <p>
                            <strong>Importante:</strong> Este análisis es generado por IA y debe ser validado por un dermatólogo certificado.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="action-buttons">
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        saveToHistory(scanResults);
                        alert('✅ Resultados guardados en el historial');
                      }}
                    >
                      <span className="btn-icon">💾</span>
                      Guardar
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={clearImage}
                    >
                      <span className="btn-icon">🗑️</span>
                      Nueva imagen
                    </button>
                  </div>
                </>
              ) : (
                <div className="empty-results">
                  <div className="empty-icon" role="img" aria-label="Documento vacío">📄</div>
                  <h3>Esperando análisis</h3>
                  <p>Sube una imagen de una lesión cutánea para obtener un análisis con IA.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información técnica para el equipo */}
        <div className="team-info">
          <details>
            <summary>👨‍💻 Información para el equipo de backend</summary>
            <div className="team-content">
              <h4>✅ Backend funcionando correctamente</h4>
              <p>El backend ya está respondiendo con el formato correcto:</p>
              
              <div className="code-examples">
                <div className="code-block">
                  <h5>Formato actual (confirmado):</h5>
                  <pre>{`{
  "status": "ok",
  "resultado": "MALIGNO" | "BENIGNO",
  "probabilidad": "XX.XX%"
}`}</pre>
                </div>
              </div>
              
              <div className="endpoint-info">
                <h5>Endpoint configurado:</h5>
                <p><code>POST http://localhost:8000/api/v1/analysis_result/</code></p>
                <p><strong>Body:</strong> FormData con campo 'image'</p>
                <p><strong>Respuesta esperada:</strong> JSON con status, resultado y probabilidad</p>
              </div>

              <div className="success-message">
                <p>🎉 <strong>¡Excelente!</strong> El backend ya está funcionando correctamente.</p>
                <p>El frontend ahora procesa automáticamente este formato.</p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;