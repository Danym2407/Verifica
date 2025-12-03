/**
 * GUÍA RÁPIDA DE USO - Sistema de Verificación de Noticias
 * 
 * Este archivo contiene ejemplos de cómo usar el sistema
 */

// ============================================
// EJEMPLO 1: Uso básico del servicio
// ============================================

import { verifyNews } from './services/newsVerification';

// Verificar una URL de noticia
const url = 'https://www.bbc.com/news/article';
const results = await verifyNews(url);

console.log('Puntuación de credibilidad:', results.credibilityScore);
console.log('Recomendación:', results.recommendation.message);

// ============================================
// EJEMPLO 2: Verificar con título
// ============================================

const url2 = 'https://example.com/article';
const title = 'Científicos descubren nueva cura milagrosa';
const results2 = await verifyNews(url2, title);

// ============================================
// EJEMPLO 3: Interpretar resultados
// ============================================

const interpretResults = (results) => {
  // Puntuación de credibilidad
  console.log(`Credibilidad: ${results.credibilityScore}/100`);
  
  // Análisis de URL
  if (results.checks.urlAnalysis) {
    console.log('Dominio:', results.checks.urlAnalysis.domain);
    console.log('Rating:', results.checks.urlAnalysis.sourceRating.rating);
  }
  
  // Fact checks encontrados
  if (results.checks.factChecks) {
    console.log(`Fact checks encontrados: ${results.checks.factChecks.length}`);
    results.checks.factChecks.forEach(fc => {
      console.log('- Claim:', fc.text);
      console.log('  Rating:', fc.claimReview?.[0]?.textualRating);
    });
  }
  
  // Verificación de fuente
  if (results.checks.sourceVerification) {
    console.log('Total de artículos:', results.checks.sourceVerification.totalArticles);
  }
};

// ============================================
// EJEMPLO 4: URLs de prueba
// ============================================

// Fuentes confiables (deberían dar alta credibilidad)
const confiableSources = [
  'https://www.reuters.com/article/...',
  'https://www.bbc.com/news/...',
  'https://apnews.com/article/...',
  'https://www.elpais.com/...'
];

// Fuentes cuestionables
const cuestionableSources = [
  'https://theonion.com/article/...',  // Satírico
  'https://sitioinventado.com/...'     // Desconocido
];

// ============================================
// EJEMPLO 5: Manejo de errores
// ============================================

const verifyWithErrorHandling = async (url) => {
  try {
    const results = await verifyNews(url);
    
    if (results.error) {
      console.error('Error durante la verificación:', results.error);
      return null;
    }
    
    return results;
  } catch (error) {
    console.error('Error al verificar:', error);
    return null;
  }
};

// ============================================
// EJEMPLO 6: Uso en componente React
// ============================================

/*
import { verifyNews } from '@/services/newsVerification';

const MyComponent = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleVerify = async (url) => {
    setLoading(true);
    try {
      const data = await verifyNews(url);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {loading && <p>Verificando...</p>}
      {results && (
        <div>
          <p>Credibilidad: {results.credibilityScore}%</p>
          <p>{results.recommendation.message}</p>
        </div>
      )}
    </div>
  );
};
*/

// ============================================
// NOTAS IMPORTANTES
// ============================================

/*
1. Configura tus API keys en el archivo .env antes de usar

2. El sistema funciona sin API keys pero con datos simulados

3. Resultados típicos:
   - 75-100: Alta credibilidad
   - 50-74: Credibilidad moderada
   - 0-49: Baja credibilidad

4. Las APIs gratuitas tienen límites:
   - Google Fact Check: 10,000/día
   - NewsAPI: 100/día
   - SerpAPI: 100/mes

5. Para producción, considera implementar:
   - Backend API para ocultar keys
   - Caché de resultados
   - Rate limiting
   - Manejo robusto de errores
*/
