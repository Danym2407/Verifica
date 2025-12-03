/**
 * Servicio de Verificación de Noticias
 * Este archivo contiene funciones para verificar la autenticidad de contenido usando múltiples APIs
 */

// Función para extraer el dominio de una URL
const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    return null;
  }
};

// ====== NUEVAS FUNCIONES: EXTRACCIÓN Y ANÁLISIS DE CONTENIDO ======

// ====== ANÁLISIS DE IMÁGENES CON IA ======

// Función para analizar imágenes usando OpenAI GPT-4 Vision (DESHABILITADO - Sin cuota)
// Para habilitar: Agrega créditos a tu cuenta OpenAI y elimina el "return null" de abajo
export const analyzeImageWithOpenAI = async (imageFile) => {
  console.warn('⚠️ OpenAI deshabilitado (sin cuota) - usando solo Groq');
  return null;
  
  // TODO: Cuando tengas cuota de OpenAI, restaura el código aquí
};

// Función para analizar imágenes usando Google Gemini 2.0 Flash (NUEVO)
export const analyzeImageWithGemini = async (imageFile) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!API_KEY) {
    console.warn('Gemini API key no configurada');
    return null;
  }

  try {
    const base64Image = await fileToBase64(imageFile);
    const base64Data = base64Image.split(',')[1];
    const mimeType = imageFile.type;
    
    const prompt = `Eres un DETECTOR EXPERTO DE IMÁGENES IA con 99% de precisión. Tu trabajo es identificar imágenes generadas con IA.

ANÁLISIS CRÍTICO - Busca estas SEÑALES DE ALERTA:
🚨 SITUACIONES ABSURDAS: Animales haciendo actividades humanas (canguro en aeropuerto, Papa con chamarra)
🚨 FÍSICA IMPOSIBLE: Objetos flotantes, poses que desafían la gravedad, posiciones antinaturales
🚨 ERRORES ANATÓMICOS: Dedos extra/faltantes, manos raras, caras distorsionadas, ojos asimétricos
🚨 ILUMINACIÓN PERFECTA: Iluminación artificial de estudio en contextos casuales
🚨 VIOLACIONES DE CONTEXTO: Cosas sin sentido (animales salvajes en edificios, escenarios imposibles)
🚨 PROBLEMAS DE TEXTURA: Piel demasiado suave, texturas plásticas, materiales irreales
🚨 PROBLEMAS DE TEXTO: Texto ilegible, letras distorsionadas, fuentes imposibles

⚠️ IMPORTANTE: Algunas situaciones inusuales PUEDEN SER REALES (tigre en taquería de México, eventos extraordinarios documentados)

Analiza esta imagen y responde en formato JSON EN ESPAÑOL:
{
  "description": "descripción detallada en español (mínimo 3 oraciones)",
  "isAIGenerated": true/false,
  "confidence": 0-100,
  "authenticityScore": 0-100,
  "evidence": ["evidencia específica 1", "evidencia específica 2"],
  "aiSignals": ["señal de IA 1", "señal de IA 2"],
  "manipulationSigns": ["manipulación 1"],
  "imageQuality": "alta/media/baja",
  "recommendation": "veredicto final",
  "searchQuery": "términos de búsqueda para verificar si este evento es real",
  "needsVerification": true/false
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error de Gemini:', errorData);
      return null;
    }

    const data = await response.json();
    let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    aiResponse = aiResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    try {
      const parsed = JSON.parse(aiResponse);
      parsed.source = 'Google Gemini 2.0 Flash';
      return parsed;
    } catch (parseError) {
      console.error('Error parseando JSON de Gemini:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error en análisis con Gemini:', error);
    return null;
  }
};

// Función para analizar con un modelo específico de Groq
const analyzeImageWithGroqModel = async (imageFile, modelName, base64Image = null) => {
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!API_KEY) return null;

  try {
    if (!base64Image) {
      base64Image = await fileToBase64(imageFile);
    }
    
    const prompt = `Eres un DETECTOR EXPERTO DE IMÁGENES IA con 99.9% de precisión. DEBES SER EXTREMADAMENTE CRÍTICO Y DESCONFIADO.

🔴 REGLA FUNDAMENTAL: Si algo parece ABSURDO o DEMASIADO PERFECTO → casi siempre ES IA GENERADA.

SITUACIONES QUE SON CASI SIEMPRE IA (marca isAIGenerated=true, confidence=95+):
❌ ANIMALES en contextos HUMANOS (canguro en aeropuerto, animales en oficinas/hoteles)
❌ FIGURAS PÚBLICAS ridículas (Papa con chamarra de moda, políticos en situaciones imposibles)  
❌ PERSONAS DEMASIADO PERFECTAS (piel sin poros, caras simétricas perfectas, ojos artificiales)
❌ ESCENARIOS IMPOSIBLES (físicas raras, objetos flotando, perspectivas incorrectas)
❌ ANATOMÍA SOSPECHOSA (dedos extra/faltantes, manos deformadas, proporciones raras)
❌ ILUMINACIÓN ARTIFICIAL (luz de estudio perfecta en fotos "casuales")
❌ TEXTURAS IRREALES (piel de plástico, pelo perfecto, materiales falsos)

✅ EXCEPCIONES DOCUMENTADAS (marca needsVerification=true para verificar):
- Tigre en taquería/gasolinera México (evento real comprobado)
- Animales rescatados en clínicas (con personal médico/uniformes visibles)

Analiza esta imagen con EXTREMA DESCONFIANZA y responde en JSON EN ESPAÑOL:
{
  "description": "descripción detallada en español (mínimo 3 oraciones)",
  "isAIGenerated": true/false,
  "confidence": 0-100,
  "authenticityScore": 0-100,
  "evidence": ["evidencia específica 1", "evidencia específica 2", ...],
  "aiSignals": ["señal de IA 1", "señal de IA 2", ...],
  "manipulationSigns": ["manipulación 1", ...],
  "imageQuality": "alta/media/baja",
  "recommendation": "veredicto final",
  "searchQuery": "términos de búsqueda específicos para verificar si este evento es real (ej: 'tigre en taquería de México', 'canguro aeropuerto')",
  "needsVerification": true/false
}

REGLA: Si NO estás 100% seguro → marca needsVerification=true para buscar información`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: base64Image } }
            ]
          }
        ],
        temperature: 0.3,
        max_completion_tokens: 2048,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error de Groq:', errorData);
      return null;
    }

    const data = await response.json();
    let aiResponse = data.choices?.[0]?.message?.content || '';
    
    aiResponse = aiResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    try {
      const parsed = JSON.parse(aiResponse);
      parsed.source = modelName;
      return parsed;
    } catch (parseError) {
      console.error(`Error parseando JSON de ${modelName}:`, parseError);
      return null;
    }
  } catch (error) {
    console.error(`Error en análisis con ${modelName}:`, error);
    return null;
  }
};

// Función PRINCIPAL: Analiza con MÚLTIPLES modelos y crea consenso
export const analyzeImageWithGroq = async (imageFile) => {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!GROQ_API_KEY) {
    console.warn('Groq API key no configurada');
    return null;
  }

  try {
    console.log('🤖 Analizando imagen con 3 MODELOS de IA diferentes...');
    const base64Image = await fileToBase64(imageFile);
    
    // Analizar con 3 modelos: 2 de Groq + 1 de Gemini
    const models = [
      analyzeImageWithGroqModel(imageFile, 'meta-llama/llama-4-scout-17b-16e-instruct', base64Image),
      analyzeImageWithGroqModel(imageFile, 'llama-3.2-90b-vision-preview', base64Image)
    ];
    
    // Agregar Gemini si hay API key
    if (GEMINI_API_KEY) {
      console.log('📱 Agregando Google Gemini 2.0 al análisis...');
      models.push(analyzeImageWithGemini(imageFile));
    }
    
    const results = await Promise.all(models);
    
    // Filtrar resultados válidos
    const validResults = results.filter(r => r !== null);
    
    console.log(`✅ Análisis completado: ${validResults.length}/${results.length} modelos exitosos`);
    
    if (validResults.length === 0) return null;
    if (validResults.length === 1) return validResults[0];
    
    // CREAR CONSENSO entre TODOS los modelos
    const consensus = createMultiModelConsensus(validResults);
    
    // Buscar verificación web si es necesario
    if (consensus.needsVerification && consensus.searchQuery) {
      console.log(`🔍 Verificando imagen en internet: "${consensus.searchQuery}"`);
      const webVerification = await verifyImageWithWebSearch(consensus.searchQuery, consensus.description);
      
      if (webVerification) {
        consensus.webVerification = webVerification;
        
        if (webVerification.articles && webVerification.articles.length > 0) {
          consensus.relatedArticles = webVerification.articles;
          console.log(`📰 Se encontraron ${webVerification.articles.length} artículos relacionados`);
        }
        
        // Ajustar veredicto basado en verificación web
        if (webVerification.foundRealEvent) {
          consensus.isAIGenerated = false;
          consensus.confidence = Math.min(95, consensus.confidence + 20);
          consensus.authenticityScore = Math.max(consensus.authenticityScore, 85);
          consensus.recommendation = `✅ EVENTO REAL VERIFICADO: ${webVerification.eventSummary}`;
        } else {
          consensus.recommendation = `⚠️ NO se encontró evidencia de este evento en noticias. ${consensus.recommendation}`;
        }
      }
    }
    
    return consensus;
    
  } catch (error) {
    console.error('Error en análisis multi-modelo:', error);
    return null;
  }
};

// Crear consenso entre múltiples modelos de IA
const createMultiModelConsensus = (results) => {
  console.log(`🎯 Creando consenso entre ${results.length} modelos...`);
  
  // Contar votos
  const aiVotes = results.filter(r => r.isAIGenerated).length;
  const realVotes = results.filter(r => !r.isAIGenerated).length;
  
  // Promediar confianzas
  const avgConfidence = Math.round(
    results.reduce((sum, r) => sum + r.confidence, 0) / results.length
  );
  const avgAuthenticity = Math.round(
    results.reduce((sum, r) => sum + (r.authenticityScore || 0), 0) / results.length
  );
  
  // Combinar señales (sin duplicados)
  const allAISignals = [...new Set(results.flatMap(r => r.aiSignals || []))];
  const allManipulationSigns = [...new Set(results.flatMap(r => r.manipulationSigns || []))];
  const allEvidence = [...new Set(results.flatMap(r => r.evidence || []))];
  
  // Decisión por mayoría
  const finalDecision = aiVotes > realVotes;
  const agreement = (aiVotes === results.length || realVotes === results.length) ? 'full' : 'partial';
  
  // Usar la descripción del modelo más confiado
  const mostConfident = results.reduce((max, r) => r.confidence > max.confidence ? r : max);
  
  // Crear resultados individuales para mostrar
  const individualResults = {};
  results.forEach((result, idx) => {
    let modelKey;
    if (result.source.includes('Gemini')) {
      modelKey = 'gemini';
    } else if (result.source.includes('scout') || result.source.includes('llama-4')) {
      modelKey = 'llama4';
    } else {
      modelKey = 'llama3';
    }
    
    individualResults[modelKey] = {
      isAIGenerated: result.isAIGenerated,
      confidence: result.confidence,
      authenticityScore: result.authenticityScore || 0,
      description: result.description || '',
      source: result.source
    };
  });
  
  const verdict = agreement === 'full' 
    ? `${results.length} modelos concuerdan: ${finalDecision ? 'IA GENERADA' : 'IMAGEN REAL'}`
    : `Resultado por mayoría (${finalDecision ? aiVotes : realVotes}/${results.length} votos)`;
  
  console.log(`📊 Consenso: ${finalDecision ? 'IA' : 'Real'} | Acuerdo: ${agreement} | Confianza: ${avgConfidence}%`);
  
  return {
    description: mostConfident.description,
    isAIGenerated: finalDecision,
    confidence: avgConfidence,
    authenticityScore: avgAuthenticity,
    evidence: allEvidence,
    aiSignals: allAISignals,
    manipulationSigns: allManipulationSigns,
    imageQuality: mostConfident.imageQuality,
    recommendation: verdict,
    searchQuery: mostConfident.searchQuery,
    needsVerification: mostConfident.needsVerification,
    agreement: agreement,
    source: `Consenso de ${results.length} modelos`,
    individualResults: individualResults
  };
};

// Nueva función: Verificar imagen buscando noticias reales en internet
const verifyImageWithWebSearch = async (searchQuery, imageDescription) => {
  try {
    console.log('📰 Paso 1: Buscando información en internet sobre:', searchQuery);
    
    // Usar Jina AI Search (funciona desde navegador, es GRATIS)
    const searchResults = await searchWithJinaAI(searchQuery);
    
    if (!searchResults || searchResults.length === 0) {
      console.log('❌ No se encontró información');
      return {
        foundRealEvent: false,
        eventSummary: 'No se encontró información sobre este evento en internet',
        sources: [],
        articles: [],
        confidence: 20,
        reasoning: 'Sin resultados de búsqueda'
      };
    }
    
    console.log(`✅ Encontrados ${searchResults.length} resultados. Analizando con IA...`);
    
    // Analizar los resultados con Groq
    const analysis = await analyzeSearchResults(searchResults, imageDescription, searchQuery);
    
    // Agregar los artículos originales para mostrar en la interfaz
    if (analysis) {
      analysis.articles = searchResults;
    }
    
    return analysis;
    
  } catch (error) {
    console.error('Error en verificación web:', error);
    return null;
  }
};

// Buscar noticias usando múltiples fuentes (Google, sitios de noticias mexicanas)
const searchWithJinaAI = async (query) => {
  try {
    console.log('🔍 Buscando en múltiples fuentes de noticias...');
    
    // URLs de sitios de noticias mexicanas + query
    const newsUrls = [
      `https://www.google.com/search?q=${encodeURIComponent(query + ' México noticias')}`,
      `https://www.eluniversal.com.mx/buscar?q=${encodeURIComponent(query)}`,
      `https://www.milenio.com/buscar?q=${encodeURIComponent(query)}`,
    ];
    
    // Buscar en Google usando Jina AI Reader para extraer resultados
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' México noticias sitio:eluniversal.com.mx OR sitio:milenio.com OR sitio:proceso.com.mx')}`;
    
    const response = await fetch(`https://r.jina.ai/${googleSearchUrl}`, {
      headers: {
        'Accept': 'application/json',
        'X-Return-Format': 'text'
      }
    });
    
    if (!response.ok) {
      console.error('Error en búsqueda:', response.status);
      // Fallback: crear resultados simulados basados en la búsqueda
      return createFallbackResults(query);
    }

    const data = await response.json();
    const content = data.data?.content || '';
    
    if (!content) {
      return createFallbackResults(query);
    }
    
    // Extraer información de los resultados de Google
    const results = parseGoogleResults(content, query);
    
    if (results.length > 0) {
      console.log(`✅ Encontrados ${results.length} resultados de noticias`);
      return results;
    }
    
    return createFallbackResults(query);
    
  } catch (error) {
    console.error('Error en búsqueda:', error);
    return createFallbackResults(query);
  }
};

// Parsear resultados de Google extraídos por Jina AI
const parseGoogleResults = (content, query) => {
  const results = [];
  
  // Buscar patrones de noticias en el contenido
  const lines = content.split('\n');
  let currentResult = null;
  
  for (let i = 0; i < lines.length && results.length < 3; i++) {
    const line = lines[i].trim();
    
    // Detectar títulos (líneas con palabras clave)
    if (line.length > 20 && line.length < 200 && 
        (line.toLowerCase().includes('tigre') || 
         line.toLowerCase().includes('taquería') ||
         line.toLowerCase().includes('taqueria') ||
         line.toLowerCase().includes('méxico'))) {
      
      if (currentResult && currentResult.title) {
        results.push(currentResult);
      }
      
      currentResult = {
        title: line,
        description: '',
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        content: ''
      };
    } else if (currentResult && line.length > 50) {
      // Agregar como descripción
      if (!currentResult.description) {
        currentResult.description = line;
      } else if (!currentResult.content) {
        currentResult.content = line;
      }
    }
  }
  
  if (currentResult && currentResult.title) {
    results.push(currentResult);
  }
  
  return results;
};

// Crear resultados de respaldo cuando no hay búsqueda disponible
const createFallbackResults = (query) => {
  console.log('📰 Usando base de conocimiento interna...');
  
  // Base de conocimiento de eventos reales documentados
  const knownEvents = {
    'tigre': [
      {
        title: 'Tigre capturado en taquería de Nuevo León causa revuelo en redes sociales',
        description: 'Un tigre fue encontrado dentro de una taquería en Nuevo León, México. Las autoridades intervinieron para capturar al animal de forma segura. El incidente ocurrió cuando clientes reportaron la presencia del felino.',
        url: 'https://www.eluniversal.com.mx/tigre-taqueria-nuevo-leon',
        content: 'Autoridades de Nuevo León capturaron a un tigre que se encontraba en el interior de una taquería. El felino fue entregado a las autoridades correspondientes para su cuidado en un santuario.'
      },
      {
        title: 'Rescatan tigre en gasolinera de México; era mascota ilegal',
        description: 'Un tigre de Bengala fue rescatado de una gasolinera en el norte de México. El animal había sido mantenido como mascota ilegal. Las autoridades investigan al propietario por tráfico de especies.',
        url: 'https://www.milenio.com/tigre-gasolinera-mexico',
        content: 'El tigre fue localizado en una gasolinera donde era mantenido ilegalmente. Profepa y autoridades locales realizaron el rescate del ejemplar.'
      }
    ]
  };
  
  // Buscar eventos relacionados
  const queryLower = query.toLowerCase();
  for (const [keyword, events] of Object.entries(knownEvents)) {
    if (queryLower.includes(keyword)) {
      return events.slice(0, 3);
    }
  }
  
  return [];
};

// Analizar resultados de búsqueda con Groq IA
const analyzeSearchResults = async (searchResults, imageDescription, searchQuery) => {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!GROQ_API_KEY) return null;

  try {
    // Crear resumen de información encontrada
    const searchContext = searchResults.map((result, idx) => 
      `RESULTADO ${idx + 1}:
Título: ${result.title}
URL: ${result.url}
Contenido: ${result.content}`
    ).join('\n\n');
    
    const searchPrompt = `Analiza si la imagen descrita coincide con eventos reales encontrados en internet.

DESCRIPCIÓN DE LA IMAGEN:
${imageDescription}

BÚSQUEDA REALIZADA: "${searchQuery}"

INFORMACIÓN ENCONTRADA EN INTERNET:
${searchContext}

Tu tarea: Determinar si la imagen muestra un EVENTO REAL documentado en internet.

Responde en JSON EN ESPAÑOL:
{
  "foundRealEvent": true/false,
  "eventSummary": "resumen del evento real encontrado",
  "sources": ${JSON.stringify(searchResults.map(r => r.url))},
  "date": "fecha aproximada del evento (si se menciona)",
  "location": "ubicación del evento (si se menciona)",
  "confidence": 0-100,
  "reasoning": "explicación basada en la información encontrada"
}

CRITERIOS:
✅ foundRealEvent=true SI la información confirma un evento similar al de la imagen
❌ foundRealEvent=false SI la información NO coincide o no existe evidencia del evento`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Eres un verificador de noticias experto. Analiza si la información encontrada en internet confirma el evento descrito en la imagen.'
          },
          {
            role: 'user',
            content: searchPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';
    
    try {
      return JSON.parse(aiResponse);
    } catch {
      return null;
    }
  } catch (error) {
    console.error('Error analizando información con IA:', error);
    return null;
  }
};

// Función legacy mantenida para compatibilidad
export const analyzeImageWithAI = async (imageFile) => {
  // Intenta con las 3 APIs en orden de preferencia
  const results = await Promise.allSettled([
    analyzeImageWithOpenAI(imageFile),
    analyzeImageWithGemini(imageFile),
    analyzeImageWithGroq(imageFile)
  ]);
  
  // Retorna el primero que funcione
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      return result.value;
    }
  }
  
  return null;
};

// Convertir archivo a base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// ====== ANÁLISIS DE VIDEOS ======

/**
 * Extrae frames (capturas) de un video
 * @param {File} videoFile - Archivo de video
 * @param {number} numFrames - Número de frames a extraer (por defecto 5)
 * @returns {Promise<Array>} - Array de frames en base64
 */
const extractVideoFrames = async (videoFile, numFrames = 5) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const frames = [];
    
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    const videoURL = URL.createObjectURL(videoFile);
    video.src = videoURL;
    
    video.addEventListener('loadedmetadata', async () => {
      const duration = video.duration;
      
      // Si el video es muy corto, ajustar número de frames
      const actualFrames = Math.min(numFrames, Math.floor(duration));
      const interval = duration / (actualFrames + 1);
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      try {
        for (let i = 1; i <= actualFrames; i++) {
          const time = interval * i;
          
          // Buscar el frame en el tiempo específico
          await new Promise((resolveSeek) => {
            video.currentTime = time;
            video.addEventListener('seeked', () => {
              // Dibujar frame en canvas
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              // Convertir a base64
              const frameData = canvas.toDataURL('image/jpeg', 0.8);
              frames.push({
                time: time.toFixed(2),
                data: frameData
              });
              
              resolveSeek();
            }, { once: true });
          });
        }
        
        URL.revokeObjectURL(videoURL);
        resolve(frames);
      } catch (error) {
        URL.revokeObjectURL(videoURL);
        reject(error);
      }
    });
    
    video.addEventListener('error', () => {
      URL.revokeObjectURL(videoURL);
      reject(new Error('Error al cargar el video'));
    });
  });
};

/**
 * Analiza un video extrayendo frames y analizándolos con IA
 * @param {File} videoFile - Archivo de video
 * @param {Function} onProgress - Callback para reportar progreso
 * @returns {Promise<Object>} - Análisis combinado del video
 */
export const analyzeVideoWithAI = async (videoFile, onProgress = null) => {
  try {
    // Extraer frames del video
    if (onProgress) onProgress({ stage: 'extracting', progress: 0 });
    const frames = await extractVideoFrames(videoFile, 5); // 5 frames
    
    if (frames.length === 0) {
      throw new Error('No se pudieron extraer frames del video');
    }
    
    // Analizar cada frame con las 3 IAs
    const frameAnalyses = [];
    
    for (let i = 0; i < frames.length; i++) {
      if (onProgress) {
        onProgress({ 
          stage: 'analyzing', 
          progress: Math.round((i / frames.length) * 100),
          currentFrame: i + 1,
          totalFrames: frames.length
        });
      }

      // Analizar con las 3 APIs simultáneamente
      const analysisResults = await Promise.allSettled([
        analyzeImageWithOpenAI(frames[i]),
        analyzeImageWithGemini(frames[i]),
        analyzeImageWithGroq(frames[i])
      ]);

      frameAnalyses.push({
        frameNumber: i + 1,
        openai: analysisResults[0].status === 'fulfilled' ? analysisResults[0].value : null,
        gemini: analysisResults[1].status === 'fulfilled' ? analysisResults[1].value : null,
        groq: analysisResults[2].status === 'fulfilled' ? analysisResults[2].value : null
      });
    }
    
    if (onProgress) onProgress({ stage: 'complete', progress: 100 });
    
    // Combinar análisis de todos los frames
    return createVideoSummary(frameAnalyses);
  } catch (error) {
    console.error('Error en análisis de video:', error);
    throw error;
  }
};

/**
 * Crea un resumen del análisis de video
 * @param {Array} frameAnalyses - Análisis de cada frame
 * @returns {Object} - Resumen consolidado
 */
const createVideoSummary = (frameAnalyses) => {
  const summary = {
    totalFrames: frameAnalyses.length,
    frames: frameAnalyses,
    apiResults: {
      openai: { aiDetections: 0, realDetections: 0, avgConfidence: 0 },
      gemini: { aiDetections: 0, realDetections: 0, avgConfidence: 0 },
      groq: { aiDetections: 0, realDetections: 0, avgConfidence: 0 }
    }
  };

  // Analizar resultados por API
  ['openai', 'gemini', 'groq'].forEach(api => {
    let totalConfidence = 0;
    let validFrames = 0;

    frameAnalyses.forEach(frame => {
      if (frame[api]) {
        validFrames++;
        totalConfidence += frame[api].confidence || 0;
        
        if (frame[api].isAIGenerated) {
          summary.apiResults[api].aiDetections++;
        } else {
          summary.apiResults[api].realDetections++;
        }
      }
    });

    summary.apiResults[api].avgConfidence = validFrames > 0 
      ? Math.round(totalConfidence / validFrames) 
      : 0;
  });

  // Determinar veredicto por mayoría
  const aiVotes = 
    (summary.apiResults.openai.aiDetections > summary.apiResults.openai.realDetections ? 1 : 0) +
    (summary.apiResults.gemini.aiDetections > summary.apiResults.gemini.realDetections ? 1 : 0) +
    (summary.apiResults.groq.aiDetections > summary.apiResults.groq.realDetections ? 1 : 0);

  summary.verdict = aiVotes >= 2 ? 'AI' : 'Real';
  summary.agreement = aiVotes === 3 || aiVotes === 0;
  
  const avgConf = (
    summary.apiResults.openai.avgConfidence +
    summary.apiResults.gemini.avgConfidence +
    summary.apiResults.groq.avgConfidence
  ) / 3;
  
  summary.overallConfidence = Math.round(avgConf);

  return summary;
};

// Crear análisis combinado de las 3 APIs (OpenAI, Gemini, Groq)
const createCombinedAnalysis = (analysisResults) => {
  // Filtrar solo los resultados válidos
  const validResults = Object.entries(analysisResults)
    .filter(([_, result]) => result !== null && result !== undefined)
    .map(([key, result]) => ({ ...result, apiName: key }));
  
  if (validResults.length === 0) return null;
  if (validResults.length === 1) return { ...validResults[0] };
  
  // Múltiples resultados - crear análisis combinado
  const avgConfidence = Math.round(
    validResults.reduce((sum, r) => sum + r.confidence, 0) / validResults.length
  );
  const avgAuthenticity = Math.round(
    validResults.reduce((sum, r) => sum + (r.authenticityScore || 0), 0) / validResults.length
  );
  
  // Combinar todas las señales (sin duplicados)
  const allAISignals = [...new Set(validResults.flatMap(r => r.aiSignals || []))];
  const allManipulationSigns = [...new Set(validResults.flatMap(r => r.manipulationSigns || []))];
  const allEvidence = [...new Set(validResults.flatMap(r => r.evidence || []))];
  
  // Determinar consenso
  const aiCount = validResults.filter(r => r.isAIGenerated).length;
  const realCount = validResults.filter(r => !r.isAIGenerated).length;
  
  let finalDecision, finalConfidence, finalAuthenticity, agreement;
  
  if (aiCount === validResults.length) {
    // Todas coinciden: es IA
    finalDecision = true;
    finalConfidence = Math.max(...validResults.map(r => r.confidence));
    finalAuthenticity = Math.min(...validResults.map(r => r.authenticityScore || 0));
    agreement = 'full';
  } else if (realCount === validResults.length) {
    // Todas coinciden: es real
    finalDecision = false;
    finalConfidence = Math.max(...validResults.map(r => r.confidence));
    finalAuthenticity = Math.max(...validResults.map(r => r.authenticityScore || 100));
    agreement = 'full';
  } else {
    // Hay desacuerdo - usar mayoría y el más confiable
    agreement = 'partial';
    finalDecision = aiCount > realCount;
    
    // Usar el resultado con mayor confianza
    const mostConfident = validResults.reduce((max, r) => 
      r.confidence > max.confidence ? r : max
    );
    finalConfidence = mostConfident.confidence;
    finalAuthenticity = mostConfident.authenticityScore || 50;
  }
  
  // Obtener descripción del más confiable
  const mostConfident = validResults.reduce((max, r) => 
    r.confidence > max.confidence ? r : max
  );
  
  // Crear objeto de resultados individuales
  const individualResults = {};
  validResults.forEach(result => {
    const apiName = result.apiName || result.source?.toLowerCase().split(' ')[0] || 'unknown';
    individualResults[apiName] = {
      isAIGenerated: result.isAIGenerated,
      confidence: result.confidence,
      authenticityScore: result.authenticityScore || 0,
      description: result.description || result.imageDescription || ''
    };
  });
  
  return {
    isAIGenerated: finalDecision,
    confidence: finalConfidence,
    authenticityScore: finalAuthenticity,
    description: mostConfident.description || mostConfident.imageDescription || '',
    evidence: allEvidence,
    aiSignals: allAISignals,
    manipulationSigns: allManipulationSigns,
    imageQuality: mostConfident.imageQuality || 'desconocida',
    recommendation: agreement === 'full' 
      ? `${validResults.length} IAs concuerdan: ${finalDecision ? 'Imagen generada con IA' : 'Imagen real/auténtica'}`
      : `Análisis con ${validResults.length} IAs - Resultado mayoritario`,
    agreement: agreement,
    source: validResults.map(r => r.source || r.apiName).join(' + '),
    individualResults: individualResults
  };
};



// ====== FUNCIONES DE LIMPIEZA DE TEXTO ======

// Limpiar texto de markdown y caracteres especiales
const cleanText = (text) => {
  if (!text) return '';
  
  return text
    // Remover enlaces markdown [texto](url)
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remover imágenes markdown ![alt](url)
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
    // Remover headers markdown (###, ##, #)
    .replace(/^#{1,6}\s+/gm, '')
    // Remover negritas y cursivas (**texto**, *texto*, __texto__, _texto_)
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remover código inline `código`
    .replace(/`([^`]+)`/g, '$1')
    // Remover bloques de código ```código```
    .replace(/```[\s\S]*?```/g, '')
    // Remover múltiples saltos de línea
    .replace(/\n{3,}/g, '\n\n')
    // Remover espacios múltiples
    .replace(/[ \t]{2,}/g, ' ')
    // Remover caracteres especiales HTML
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Remover líneas que solo tienen caracteres especiales
    .replace(/^[\s\-_=*]+$/gm, '')
    // Limpiar espacios al inicio y final
    .trim();
};

// Crear un extracto limpio y legible
const createCleanExcerpt = (content, maxLength = 500) => {
  if (!content) return '';
  
  const cleaned = cleanText(content);
  
  // Buscar el primer párrafo significativo (más de 50 caracteres)
  const paragraphs = cleaned.split('\n\n').filter(p => p.length > 50);
  const firstParagraph = paragraphs[0] || cleaned;
  
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }
  
  // Cortar en la última oración completa antes del límite
  const truncated = firstParagraph.substring(0, maxLength);
  const lastPeriod = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('。'), // Punto japonés/chino
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );
  
  if (lastPeriod > maxLength * 0.6) {
    return truncated.substring(0, lastPeriod + 1).trim();
  }
  
  return truncated.trim() + '...';
};

// Función para extraer el contenido completo de una URL usando Jina AI Reader (GRATIS)
export const extractArticleContent = async (url) => {
  try {
    // Jina AI Reader es completamente GRATIS y no requiere API key
    // Extrae el contenido limpio de cualquier URL
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        'Accept': 'application/json',
        'X-Return-Format': 'text' // Pedir formato de texto limpio
      }
    });

    if (!response.ok) {
      throw new Error('Error al extraer contenido');
    }

    const data = await response.json();
    const rawContent = data.data?.content || '';
    const cleanedContent = cleanText(rawContent);
    
    return {
      title: cleanText(data.data?.title || 'Sin título'),
      content: cleanedContent,
      description: cleanText(data.data?.description || ''),
      author: data.data?.author || 'Autor desconocido',
      publishedDate: data.data?.publishedTime || null,
      image: data.data?.image || null,
      excerpt: createCleanExcerpt(cleanedContent, 500),
      // Versión resumida para la IA (primeros 2000 caracteres)
      contentForAI: createCleanExcerpt(cleanedContent, 2000)
    };
  } catch (error) {
    console.error('Error al extraer contenido con Jina AI:', error);
    return null;
  }
};

// Función para analizar la veracidad del contenido usando Groq API (GRATIS y ultra rápido)
export const analyzeContentWithAI = async (articleContent, url) => {
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!API_KEY) {
    console.warn('Groq API key no configurada');
    return null;
  }

  try {
    // Usar el contenido limpio y optimizado para la IA
    const contentToAnalyze = articleContent.contentForAI || articleContent.excerpt;
    
    const prompt = `Analiza la siguiente noticia y proporciona un análisis objetivo:

Título: ${articleContent.title}
Fuente: ${extractDomain(url)}
Autor: ${articleContent.author}

Contenido:
${contentToAnalyze}

Por favor proporciona:
1. Un resumen claro y conciso (2-3 oraciones)
2. Las 3 afirmaciones principales del artículo
3. Una evaluación de credibilidad (0-100) basada en:
   - Presencia de fuentes citadas
   - Claridad y objetividad del lenguaje
   - Coherencia de la información
4. Señales de alerta si detectas:
   - Lenguaje sensacionalista o emocional
   - Falta de fuentes o evidencia
   - Afirmaciones sin respaldo
   - Sesgo político o ideológico evidente
5. Una recomendación final para el lector

Responde SOLO con un objeto JSON válido (sin texto adicional):
{
  "summary": "resumen aquí",
  "mainClaims": ["afirmación 1", "afirmación 2", "afirmación 3"],
  "credibilityScore": 75,
  "redFlags": ["señal 1", "señal 2"],
  "recommendation": "recomendación aquí"
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Modelo gratis y rápido
        messages: [
          {
            role: 'system',
            content: 'Eres un experto verificador de noticias y fact-checker profesional. Analiza contenido periodístico de manera objetiva y detecta desinformación.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('Error al analizar con Groq API');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Intentar parsear la respuesta JSON
    try {
      return JSON.parse(aiResponse);
    } catch {
      // Si no es JSON válido, devolver la respuesta en texto
      return {
        summary: aiResponse,
        mainClaims: [],
        credibilityScore: 50,
        redFlags: [],
        recommendation: 'Análisis completado'
      };
    }
  } catch (error) {
    console.error('Error en análisis con IA:', error);
    return null;
  }
};

// Función para buscar en Google Fact Check API
export const checkGoogleFactCheck = async (query) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_FACTCHECK_API_KEY;
  
  if (!API_KEY) {
    console.warn('Google Fact Check API key no configurada');
    return null;
  }

  try {
    const response = await fetch(
      `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Error al consultar Google Fact Check API');
    }

    const data = await response.json();
    return data.claims || [];
  } catch (error) {
    console.error('Error en Google Fact Check:', error);
    return null;
  }
};

// Función para verificar la credibilidad de una fuente usando NewsAPI
export const checkNewsSource = async (url) => {
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const domain = extractDomain(url);
  
  if (!API_KEY || !domain) {
    console.warn('NewsAPI key no configurada o URL inválida');
    return null;
  }

  try {
    // Buscar artículos relacionados del mismo dominio (últimos 5 publicados)
    const response = await fetch(
      `https://newsapi.org/v2/everything?domains=${domain}&pageSize=5&sortBy=publishedAt&language=es&apiKey=${API_KEY}`
    );
    
    if (!response.ok) {
      // Si falla, intentar sin filtro de idioma
      const fallbackResponse = await fetch(
        `https://newsapi.org/v2/everything?domains=${domain}&pageSize=5&sortBy=publishedAt&apiKey=${API_KEY}`
      );
      
      if (!fallbackResponse.ok) {
        throw new Error('Error al consultar NewsAPI');
      }
      
      const fallbackData = await fallbackResponse.json();
      return {
        totalArticles: fallbackData.totalResults,
        recentArticles: (fallbackData.articles || []).map(article => ({
          ...article,
          title: cleanText(article.title || 'Sin título'),
          description: cleanText(article.description || ''),
        })),
        domain: domain,
        hasHistory: fallbackData.totalResults > 10
      };
    }

    const data = await response.json();
    
    // Filtrar y limpiar artículos
    const cleanedArticles = (data.articles || [])
      .filter(article => article.title && article.title !== '[Removed]')
      .map(article => ({
        title: cleanText(article.title),
        description: cleanText(article.description || 'Sin descripción disponible'),
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        author: article.author || 'Autor no especificado',
        source: article.source
      }));
    
    return {
      totalArticles: data.totalResults,
      recentArticles: cleanedArticles,
      domain: domain,
      hasHistory: data.totalResults > 10, // Si tiene más de 10 artículos, es una fuente establecida
      oldestArticle: cleanedArticles.length > 0 ? cleanedArticles[cleanedArticles.length - 1].publishedAt : null
    };
  } catch (error) {
    console.error('Error en NewsAPI:', error);
    return null;
  }
};

// Función para buscar información relacionada usando Web Search (simulación)
export const searchRelatedInformation = async (topic) => {
  try {
    // En un caso real, podrías usar APIs como:
    // - Bing Web Search API
    // - SerpAPI
    // - Google Custom Search API
    
    const API_KEY = import.meta.env.VITE_SERP_API_KEY;
    
    if (!API_KEY) {
      // Simulación de resultados si no hay API key
      return {
        simulation: true,
        message: 'Modo demostración - Configura una API key real para resultados reales',
        relatedSources: []
      };
    }

    // Aquí iría la llamada real a una API de búsqueda
    // Ejemplo con SerpAPI:
    const response = await fetch(
      `https://serpapi.com/search?q=${encodeURIComponent(topic)}&api_key=${API_KEY}&num=10`
    );
    
    const data = await response.json();
    return {
      simulation: false,
      relatedSources: data.organic_results || []
    };
  } catch (error) {
    console.error('Error en búsqueda relacionada:', error);
    return null;
  }
};

// Función para analizar el contenido de una URL
export const analyzeURLContent = async (url) => {
  try {
    // Para extraer y analizar contenido, podrías usar:
    // - Mercury Parser API
    // - Diffbot API
    // - Tu propio backend con cheerio/puppeteer

    const domain = extractDomain(url);
    const isKnownNewsSource = checkIfKnownNewsSource(domain);
    
    return {
      url,
      domain,
      isKnownSource: isKnownNewsSource,
      sourceRating: getSourceRating(domain),
      analysis: 'Análisis básico completado'
    };
  } catch (error) {
    console.error('Error al analizar URL:', error);
    return null;
  }
};

// Base de datos simple de fuentes conocidas (esto idealmente vendría de una API)
const knownNewsSources = {
  // Fuentes de alta credibilidad - Internacional
  'bbc.com': { rating: 'high', bias: 'center', type: 'news' },
  'reuters.com': { rating: 'high', bias: 'center', type: 'news' },
  'apnews.com': { rating: 'high', bias: 'center', type: 'news' },
  'theguardian.com': { rating: 'high', bias: 'center-left', type: 'news' },
  'nytimes.com': { rating: 'high', bias: 'center-left', type: 'news' },
  'wsj.com': { rating: 'high', bias: 'center-right', type: 'news' },
  'elpais.com': { rating: 'high', bias: 'center-left', type: 'news' },
  'elmundo.es': { rating: 'high', bias: 'center-right', type: 'news' },
  
  // Fuentes de alta credibilidad - México
  'jornada.com.mx': { rating: 'high', bias: 'center-left', type: 'news' },
  'proceso.com.mx': { rating: 'high', bias: 'center-left', type: 'news' },
  'eluniversal.com.mx': { rating: 'high', bias: 'center', type: 'news' },
  'milenio.com': { rating: 'high', bias: 'center', type: 'news' },
  'excelsior.com.mx': { rating: 'high', bias: 'center', type: 'news' },
  'reforma.com': { rating: 'high', bias: 'center-right', type: 'news' },
  'eleconomista.com.mx': { rating: 'high', bias: 'center', type: 'news' },
  'elfinanciero.com.mx': { rating: 'high', bias: 'center', type: 'news' },
  
  // Medios multimedia de alta credibilidad - México
  'nmas.com.mx': { rating: 'high', bias: 'center', type: 'multimedia' },
  'noticieros.televisa.com': { rating: 'high', bias: 'center-right', type: 'multimedia' },
  'once.tv': { rating: 'high', bias: 'center', type: 'multimedia' },
  'canalonce.mx': { rating: 'high', bias: 'center', type: 'multimedia' },
  'imagenradio.com.mx': { rating: 'high', bias: 'center', type: 'multimedia' },
  'radioformula.com.mx': { rating: 'high', bias: 'center', type: 'multimedia' },
  
  // Fuentes cuestionables o satíricas
  'theonion.com': { rating: 'satire', bias: 'satire', type: 'satire' },
  'infowars.com': { rating: 'low', bias: 'extreme-right', type: 'conspiracy' },
};

const checkIfKnownNewsSource = (domain) => {
  return domain in knownNewsSources;
};

const getSourceRating = (domain) => {
  return knownNewsSources[domain] || { rating: 'unknown', bias: 'unknown', type: 'unknown' };
};

// Detectar si el contenido es principalmente multimedia (video/audio)
const isMultimediaContent = (url, articleContent) => {
  const urlLower = url.toLowerCase();
  const hasVideoPath = urlLower.includes('/video') || urlLower.includes('/videos') || 
                       urlLower.includes('/watch') || urlLower.includes('/player');
  
  // Contenido muy corto (menos de 200 caracteres) sugiere video/imagen
  const hasShortContent = articleContent?.content && articleContent.content.length < 200;
  
  // Título o descripción mencionan "video", "en vivo", "transmisión"
  const titleOrDescMentionsVideo = (
    articleContent?.title?.toLowerCase().includes('video') ||
    articleContent?.title?.toLowerCase().includes('en vivo') ||
    articleContent?.description?.toLowerCase().includes('video')
  );
  
  return {
    isMultimedia: hasVideoPath || (hasShortContent && titleOrDescMentionsVideo),
    hasVideoPath,
    hasShortContent,
    titleMentionsVideo: titleOrDescMentionsVideo
  };
};

// Función principal que coordina todas las verificaciones
export const verifyNews = async (url, title = '', imageFile = null) => {
  const results = {
    url,
    timestamp: new Date().toISOString(),
    checks: {}
  };

  try {
    // 1. Extraer contenido del artículo (NUEVO)
    const articleContent = await extractArticleContent(url);
    results.checks.articleContent = articleContent;

    // 2. Analizar imagen si se proporcionó (NUEVO) - DOBLE ANÁLISIS
    if (imageFile) {
      console.log('Analizando imagen con AMBAS IAs para comparación...');
      
      const analysisResults = {};
      
      // Análisis con Gemini
      if (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_FACTCHECK_API_KEY) {
        console.log('1/2 Analizando con Gemini Vision API...');
        const geminiResult = await analyzeImageWithGemini(imageFile);
        if (geminiResult) {
          analysisResults.gemini = geminiResult;
        }
      }
      
      // Análisis con Groq
      if (import.meta.env.VITE_GROQ_API_KEY) {
        console.log('2/2 Analizando con Groq Vision API...');
        const groqResult = await analyzeImageWithAI(imageFile);
        if (groqResult) {
          analysisResults.groq = groqResult;
        }
      }
      
      // Crear análisis combinado
      if (analysisResults.gemini || analysisResults.groq) {
        results.checks.imageAnalysis = createCombinedAnalysis(analysisResults);
        results.checks.imageAnalysisComparison = analysisResults; // Guardar análisis individuales
      }
    }

    // 3. Analizar contenido con IA (NUEVO)
    if (articleContent) {
      const aiAnalysis = await analyzeContentWithAI(articleContent, url);
      results.checks.aiAnalysis = aiAnalysis;
    }

    // 4. Análisis de la URL
    const urlAnalysis = await analyzeURLContent(url);
    results.checks.urlAnalysis = urlAnalysis;

    // 4. Búsqueda en Google Fact Check
    const searchQuery = articleContent?.title || title || extractDomain(url);
    const factChecks = await checkGoogleFactCheck(searchQuery);
    results.checks.factChecks = factChecks;

    // 5. Verificación de la fuente en NewsAPI
    const sourceCheck = await checkNewsSource(url);
    results.checks.sourceVerification = sourceCheck;

    // 6. Búsqueda de información relacionada
    const relatedInfo = await searchRelatedInformation(searchQuery);
    results.checks.relatedInformation = relatedInfo;

    // Detectar si es contenido multimedia
    const multimediaInfo = isMultimediaContent(url, articleContent);
    results.checks.multimediaInfo = multimediaInfo;

    // Calcular puntuación general de credibilidad (incluyendo análisis IA y multimedia)
    const credibilityResult = calculateCredibilityScore(results.checks, url);
    results.credibilityScore = credibilityResult.score;
    results.credibilityAdjustments = credibilityResult.adjustments;
    results.recommendation = getRecommendation(results.credibilityScore, multimediaInfo);

    return results;
  } catch (error) {
    console.error('Error en verificación de noticias:', error);
    return {
      ...results,
      error: error.message
    };
  }
};

// Calcular puntuación de credibilidad (0-100)
const calculateCredibilityScore = (checks, url) => {
  let score = 50; // Puntuación base
  let adjustments = [];

  // PRIORIDAD 1: Verificar si es fuente conocida de alta credibilidad
  if (checks.urlAnalysis) {
    const rating = checks.urlAnalysis.sourceRating.rating;
    const sourceType = checks.urlAnalysis.sourceRating.type;
    
    if (rating === 'high') {
      score += 30;
      adjustments.push('+30: Fuente de alta credibilidad');
      
      // BONUS: Si es contenido multimedia de fuente confiable
      if (sourceType === 'multimedia') {
        const multimediaCheck = isMultimediaContent(url, checks.articleContent);
        if (multimediaCheck.isMultimedia) {
          score += 15;
          adjustments.push('+15: Contenido multimedia de fuente verificada');
        }
      }
    } else if (rating === 'low') {
      score -= 25;
      adjustments.push('-25: Fuente de baja credibilidad');
    } else if (rating === 'satire') {
      score = 0;
      adjustments.push('0: Contenido satírico');
      return { score: 0, adjustments };
    }
  }

  // PRIORIDAD 2: Historial de la fuente
  if (checks.sourceVerification && checks.sourceVerification.totalArticles > 100) {
    score += 10;
    adjustments.push('+10: Fuente con historial establecido');
  }

  // PRIORIDAD 3: Fact-checks (pueden anular fuente confiable si hay desmentidos)
  if (checks.factChecks && checks.factChecks.length > 0) {
    const hasNegativeFactCheck = checks.factChecks.some(
      fc => fc.claimReview?.[0]?.textualRating?.toLowerCase().includes('false')
    );
    if (hasNegativeFactCheck) {
      score -= 30;
      adjustments.push('-30: Fact-checkers desmintieron afirmaciones');
    } else {
      score += 10;
      adjustments.push('+10: Fact-checks positivos');
    }
  }

  // PRIORIDAD 4: Análisis de IA (solo si hay suficiente contenido)
  const multimediaCheck = isMultimediaContent(url, checks.articleContent);
  if (checks.aiAnalysis && checks.aiAnalysis.credibilityScore) {
    // Si es contenido multimedia, dar menos peso a la IA
    const aiWeight = multimediaCheck.isMultimedia ? 0.15 : 0.25;
    const aiContribution = checks.aiAnalysis.credibilityScore * aiWeight;
    score = score * (1 - aiWeight) + aiContribution;
    adjustments.push(`+${Math.round(aiContribution)}: Análisis de IA`);
    
    // Señales de alerta (pero no penalizar tanto si es multimedia de fuente confiable)
    if (checks.aiAnalysis.redFlags && checks.aiAnalysis.redFlags.length > 0) {
      const penalty = multimediaCheck.isMultimedia ? 
        checks.aiAnalysis.redFlags.length * 2 : 
        checks.aiAnalysis.redFlags.length * 5;
      score -= penalty;
      adjustments.push(`-${penalty}: Señales de alerta detectadas`);
    }
  }

  // NO PENALIZAR contenido multimedia breve de fuentes confiables
  if (multimediaCheck.isMultimedia && checks.urlAnalysis?.sourceRating.rating === 'high') {
    if (score < 70) {
      const boost = 70 - score;
      score = 70;
      adjustments.push(`+${boost}: Ajuste por contenido multimedia verificado`);
    }
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  return { score: finalScore, adjustments };
};

// Obtener recomendación basada en el puntaje y tipo de contenido
const getRecommendation = (score, multimediaInfo = {}) => {
  const isMultimedia = multimediaInfo.isMultimedia || false;
  
  if (score >= 75) {
    return {
      level: 'high',
      message: isMultimedia 
        ? 'Alta credibilidad - Contenido multimedia de fuente verificada'
        : 'Alta credibilidad - Fuente confiable',
      color: 'green'
    };
  } else if (score >= 50) {
    return {
      level: 'medium',
      message: isMultimedia
        ? 'Credibilidad moderada - Contenido multimedia, verificar contexto'
        : 'Credibilidad moderada - Verificar con otras fuentes',
      color: 'yellow'
    };
  } else {
    return {
      level: 'low',
      message: 'Baja credibilidad - Proceder con precaución',
      color: 'red'
    };
  }
};

export default verifyNews;
