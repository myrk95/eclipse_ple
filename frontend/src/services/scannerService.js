// src/services/scannerService.js

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// class ScannerService {
//   /**
//    * Analiza una imagen enviándola al backend Django
//    * @param {File} imageFile - Archivo de imagen
//    * @param {Function} onUploadProgress - Callback para progreso de subida
//    * @returns {Promise} - Respuesta del análisis
//    */
//   async analyzeImage(imageFile, onUploadProgress) {
//     const formData = new FormData();
//     formData.append('image', imageFile);
//     formData.append('filename', imageFile.name);
//     formData.append('content_type', imageFile.type);

//     const config = {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       onUploadProgress: (progressEvent) => {
//         const percentCompleted = Math.round(
//           (progressEvent.loaded * 100) / progressEvent.total
//         );
//         onUploadProgress(percentCompleted);
//       },
//       timeout: 60000,
//     };

//     // USAR EL ENDPOINT QUE YA FUNCIONA según tu imagen
//     const endpoint = '/api/v1/analysis_result/';
    
//     try {
//       console.log(`Enviando imagen al endpoint: ${API_BASE_URL}${endpoint}`);
//       const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//         method: 'POST',
//         body: formData,
//       });
      
//       if (!response.ok) {
//         throw new Error(`Error HTTP: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error analizando imagen:', error);
//       throw error;
//     }
//   }

//   /**
//    * Procesa la respuesta del backend para adaptarla al formato esperado por el frontend
//    * @param {Object} backendData - Datos crudos del backend (como en tu imagen)
//    * @returns {Object} - Datos procesados en el formato que tu Scanner.jsx espera
//    */
//   processBackendResponse(backendData) {
//     console.log('Datos recibidos del backend:', backendData);
    
//     // Formato del backend según tu imagen:
//     // {
//     //   "status": "ok",
//     //   "resultado": "MALIGNO",
//     //   "probabilidad": "100.00%"
//     // }
    
//     const rawData = backendData;
    
//     // Convertir el formato del backend al formato que tu componente espera
//     const isMalignant = rawData.resultado === 'MALIGNO';
//     const probabilidad = parseFloat(rawData.probabilidad) / 100 || 0; // Convertir "100.00%" a 1.0

//     // Determinar nivel de riesgo basado en la probabilidad
//     let riskLevel = 'BAJO';
//     if (probabilidad >= 0.7) {
//       riskLevel = 'ALTO';
//     } else if (probabilidad >= 0.3) {
//       riskLevel = 'MEDIO';
//     }

//     // Mapeo de diagnóstico
//     const diagnosisMapping = {
//       'MALIGNO': 'Lesión Maligna',
//       'BENIGNO': 'Lesión Benigna'
//     };

//     const diagnosisText = diagnosisMapping[rawData.resultado] || rawData.resultado;

//     // Generar descripción detallada
//     const description = `La lesión ha sido clasificada como ${isMalignant ? 'MALIGNA' : 'BENIGNA'} ` +
//       `con una probabilidad del ${(probabilidad * 100).toFixed(2)}%. ` +
//       `Se recomienda ${isMalignant ? 'consulta urgente con un dermatólogo' : 'seguimiento periódico'}.`;

//     // Generar recomendaciones y próximos pasos
//     const recommendations = this.generateRecommendations(riskLevel, isMalignant);
//     const nextSteps = this.generateNextSteps(riskLevel, isMalignant);

//     return {
//       // Datos del análisis
//       isMalignant: isMalignant,
//       melanomaProbability: probabilidad,
//       diagnosis: diagnosisText,
//       confidence: probabilidad * 100,
//       riskLevel: riskLevel,
//       description: description,
//       recommendations: recommendations,
//       nextSteps: nextSteps,
      
//       // Metadatos
//       timestamp: new Date().toLocaleString('es-ES', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       }),
//       scanId: `SCAN-${Date.now()}`,
      
//       // Datos crudos del backend para depuración
//       rawData: rawData,
//     };
//   }

//   /**
//    * Genera recomendaciones basadas en el nivel de riesgo
//    * @param {string} riskLevel - Nivel de riesgo (BAJO, MEDIO, ALTO)
//    * @param {boolean} isMalignant - Si es maligno
//    * @returns {Array} - Lista de recomendaciones
//    */
//   generateRecommendations(riskLevel, isMalignant) {
//     const baseRecommendations = [
//       'Protección solar diaria con FPS 50+',
//       'Evitar exposición solar directa entre las 10:00 y 16:00 horas',
//       'Autoexamen mensual de la piel'
//     ];

//     if (isMalignant || riskLevel === 'ALTO') {
//       return [
//         'Consulta dermatológica urgente (1-2 semanas)',
//         'No automedicar ni manipular la lesión',
//         'Considerar biopsia según criterio médico',
//         ...baseRecommendations
//       ];
//     } else if (riskLevel === 'MEDIO') {
//       return [
//         'Consulta dermatológica en los próximos 30 días',
//         'Fotografía de seguimiento en 3 meses',
//         'Evitar la exposición solar en la zona afectada',
//         ...baseRecommendations
//       ];
//     } else {
//       return [
//         'Revisión anual con dermatólogo',
//         'Monitorear cambios en tamaño, forma o color cada 6 meses',
//         'Documentar la lesión con fotografías periódicas',
//         ...baseRecommendations
//       ];
//     }
//   }

//   /**
//    * Genera próximos pasos basados en el nivel de riesgo
//    * @param {string} riskLevel - Nivel de riesgo (BAJO, MEDIO, ALTO)
//    * @param {boolean} isMalignant - Si es maligno
//    * @returns {Array} - Lista de próximos pasos
//    */
//   generateNextSteps(riskLevel, isMalignant) {
//     if (isMalignant || riskLevel === 'ALTO') {
//       return [
//         { text: 'Consulta urgente con dermatólogo', priority: 'high' },
//         { text: 'Evaluación para posible biopsia', priority: 'high' }
//       ];
//     } else if (riskLevel === 'MEDIO') {
//       return [
//         { text: 'Consulta en 1 mes', priority: 'medium' },
//         { text: 'Fotografía comparativa en 3 meses', priority: 'medium' }
//       ];
//     } else {
//       return [
//         { text: 'Autoexamen mensual', priority: 'normal' },
//         { text: 'Consulta anual programada', priority: 'normal' }
//       ];
//     }
//   }

//   /**
//    * Valida un archivo de imagen
//    * @param {File} file - Archivo a validar
//    * @throws {Error} - Si el archivo no es válido
//    */
//   validateFile(file) {
//     const maxSize = 10 * 1024 * 1024; // 10MB
//     const allowedTypes = [
//       'image/jpeg',
//       'image/jpg', 
//       'image/png',
//       'image/gif',
//       'image/webp',
//       'image/bmp'
//     ];

//     if (!allowedTypes.includes(file.type)) {
//       throw new Error(`Formato no válido (${file.type}). Usa JPG, PNG, GIF, WebP o BMP.`);
//     }

//     if (file.size > maxSize) {
//       throw new Error(`La imagen es muy grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo 10MB.`);
//     }

//     return true;
//   }
// }

// export default new ScannerService();