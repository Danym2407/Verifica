# 🔍 Cómo Funciona el Verificador de Noticias

## 📋 Resumen Rápido

Tu aplicación **extrae**, **analiza** y **verifica** noticias automáticamente usando 3 APIs gratuitas:

```
URL de Noticia
    ↓
[1] Jina AI → Extrae contenido completo
    ↓
[2] Groq AI → Analiza con inteligencia artificial
    ↓
[3] Google Fact Check → Busca verificaciones previas
    ↓
Resultado: Score de credibilidad + Recomendación
```

---

## 🎬 Flujo Completo Paso a Paso

### **Entrada del Usuario:**
```
Usuario ingresa: https://www.jornada.com.mx/noticia/trump-fake-news
```

---

### **PASO 1: Extracción de Contenido** 📄
**API: Jina AI Reader (GRATIS, sin key)**

```javascript
// Tu código hace:
const content = await extractArticleContent(url);

// Jina extrae automáticamente:
{
  title: "Trump llena los medios de fake news",
  author: "La Jornada",
  publishedDate: "2025-11-24",
  content: "[Texto completo del artículo]",
  excerpt: "[Primeros 500 caracteres]"
}
```

**Qué hace Jina AI:**
1. Accede a la URL
2. Elimina anuncios, menús, popups
3. Extrae solo el contenido editorial
4. Identifica título, autor, fecha
5. Devuelve texto limpio en 1-2 segundos

---

### **PASO 2: Análisis con IA** 🧠
**API: Groq (Llama 3.3 70B) - GRATIS**

```javascript
// Tu código envía el contenido a Groq:
const analysis = await analyzeContentWithAI(content, url);

// Groq analiza y responde:
{
  summary: "El artículo analiza cómo Trump ha utilizado 
           desinformación sistemática en medios...",
  
  mainClaims: [
    "Trump ha difundido fake news",
    "Los medios replican sin verificar"
  ],
  
  credibilityScore: 72,
  
  redFlags: [
    "Lenguaje con carga política",
    "Artículo de opinión vs reportaje"
  ],
  
  recommendation: "Verificar con múltiples fuentes. 
                   La Jornada es confiable pero este 
                   es un artículo de análisis."
}
```

**Qué hace Groq:**
1. Lee el contenido completo
2. Identifica afirmaciones principales
3. Detecta señales de alerta
4. Evalúa credibilidad (0-100)
5. Genera recomendación
6. Todo en 2-3 segundos

---

### **PASO 3: Verificación con Fact-Checkers** ✅
**API: Google Fact Check - GRATIS**

```javascript
// Tu código busca verificaciones previas:
const factChecks = await checkGoogleFactCheck("Trump fake news");

// Google busca en todas las bases de fact-checkers:
[
  {
    claim: "Trump difunde fake news",
    claimant: "Publicación viral",
    claimReview: [{
      publisher: "Reuters Fact Check",
      textualRating: "TRUE",
      url: "https://reuters.com/fact-check/..."
    }]
  },
  {
    claim: "Medios replican sin verificar",
    claimReview: [{
      publisher: "PolitiFact",
      textualRating: "MOSTLY TRUE",
      url: "https://politifact.com/..."
    }]
  }
]
```

**Qué hace Google Fact Check:**
1. Busca en bases de datos de:
   - Reuters
   - Snopes
   - PolitiFact
   - AFP Fact Check
   - FactCheck.org
   - 100+ verificadores más
2. Encuentra verificaciones previas
3. Devuelve rating (TRUE, FALSE, MIXED, etc.)
4. Incluye links a verificaciones completas

---

### **PASO 4: Cálculo de Credibilidad** 📊

```javascript
// Tu código combina todos los análisis:
let score = 50; // Base

// +30% Peso del análisis de IA
if (aiAnalysis.credibilityScore) {
  score = score * 0.7 + aiAnalysis.credibilityScore * 0.3;
}

// +20 puntos si la fuente es confiable (La Jornada)
if (domain === 'jornada.com.mx') {
  score += 20;
}

// +10 puntos si fact-checkers confirman
if (factChecks.some(fc => fc.rating === 'TRUE')) {
  score += 10;
}

// -5 puntos por cada señal de alerta
score -= aiAnalysis.redFlags.length * 5;

// Score final: 75/100
```

---

### **PASO 5: Presentación al Usuario** 🎨

```
┌────────────────────────────────────────────────┐
│  🔍 RESULTADOS DE VERIFICACIÓN                 │
├────────────────────────────────────────────────┤
│  Credibilidad: ███████▓░░ 75/100              │
│  ✅ Alta Credibilidad                          │
├────────────────────────────────────────────────┤
│                                                │
│  📄 CONTENIDO EXTRAÍDO                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Título: Trump llena los medios de fake news  │
│  Autor: La Jornada                             │
│  Fecha: 24 de noviembre, 2025                  │
│                                                │
│  Extracto: El expresidente Donald Trump ha     │
│  utilizado de forma sistemática la             │
│  desinformación como herramienta política...   │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  🧠 ANÁLISIS CON IA                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📝 Resumen:                                   │
│  El artículo analiza cómo Trump ha utilizado   │
│  desinformación sistemática en medios de       │
│  comunicación, presentándola como verdad       │
│  oficial.                                      │
│                                                │
│  🎯 Afirmaciones Principales:                  │
│  • Trump ha difundido fake news                │
│  • Los medios replican sin verificar           │
│                                                │
│  ⚠️ Señales de Alerta:                         │
│  • Lenguaje con carga política                 │
│  • Artículo de análisis/opinión                │
│                                                │
│  💡 Recomendación:                             │
│  La Jornada es fuente confiable pero este es   │
│  un artículo de análisis. Verificar con        │
│  fuentes adicionales para información objetiva.│
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  ✅ VERIFICACIONES DE FACT-CHECKERS (2)        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  1. Reuters Fact Check                         │
│     Rating: TRUE ✓                             │
│     "Trump has spread false information..."    │
│     🔗 Ver verificación completa               │
│                                                │
│  2. PolitiFact                                 │
│     Rating: MOSTLY TRUE ⚠                      │
│     "Media outlets sometimes republish..."     │
│     🔗 Ver verificación completa               │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 🔄 Comparación: Con vs Sin Groq API

### ✅ **CON Groq API (Recomendado)**

```
URL ingresada
    ↓
✅ Extrae contenido completo
✅ Genera resumen automático
✅ Identifica afirmaciones
✅ Detecta señales de alerta
✅ Analiza credibilidad con IA
✅ Busca fact-checks
✅ Calcula score combinado
    ↓
Resultado: Análisis completo y detallado
```

### ⚠️ **SIN Groq API**

```
URL ingresada
    ↓
❌ No extrae contenido
❌ No genera resumen
❌ No identifica afirmaciones
❌ No detecta señales de alerta
❌ No analiza con IA
✅ Busca fact-checks
⚠️ Calcula score básico
    ↓
Resultado: Solo verificaciones de Google
```

---

## 📊 Ejemplos Reales

### Ejemplo 1: Noticia Verificada ✅

**Input:**
```
https://www.bbc.com/news/world-europe-67890123
```

**Proceso:**
1. Jina extrae: Título, autor, contenido
2. Groq analiza: "Noticia factual, bien documentada"
3. Google: Encuentra verificaciones positivas
4. Score: 92/100

**Output:**
```
✅ Alta Credibilidad (92/100)
📰 BBC News - Fuente muy confiable
✓ Verificado por Reuters
✓ Verificado por AP News
```

---

### Ejemplo 2: Fake News ❌

**Input:**
```
https://sitio-dudoso.com/5g-causa-covid
```

**Proceso:**
1. Jina extrae: Contenido sensacionalista
2. Groq detecta: "Sin fuentes, lenguaje alarmista"
3. Google: Múltiples fact-checks dicen "FALSE"
4. Score: 12/100

**Output:**
```
❌ Baja Credibilidad (12/100)
⚠️ Información desmentida

🚫 Reuters: FALSE
🚫 Snopes: FALSE
🚫 AFP: FALSE

Recomendación: NO COMPARTIR
```

---

### Ejemplo 3: Noticia Local Sin Verificaciones ⚠️

**Input:**
```
https://periodico-local.com/noticia-regional
```

**Proceso:**
1. Jina extrae: Contenido local
2. Groq analiza: "Bien escrito, cita fuentes"
3. Google: No encuentra verificaciones previas
4. Score: 58/100

**Output:**
```
⚠️ Credibilidad Moderada (58/100)
📰 Fuente no conocida
ℹ️ No hay verificaciones previas

Recomendación: Buscar en otros medios
```

---

## ⚡ Velocidad del Sistema

```
Paso 1: Jina AI Reader      → 1-2 segundos
Paso 2: Groq Analysis       → 2-3 segundos
Paso 3: Google Fact Check   → 0.5-1 segundo
Paso 4: Cálculo Score       → Instantáneo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:                      → 4-6 segundos
```

**¡Ultra rápido!** En menos de 10 segundos tienes análisis completo.

---

## 🎯 ¿Qué hace cada API?

| API | Función | Velocidad | Gratis |
|-----|---------|-----------|--------|
| **Jina AI** | Extrae contenido limpio | 1-2 seg | ✅ Sí |
| **Groq** | Analiza con IA | 2-3 seg | ✅ Sí |
| **Google** | Busca fact-checks | 0.5-1 seg | ✅ Sí |

---

## 💡 Tips de Uso

### ✅ **Funciona mejor con:**
- URLs de noticias completas
- Artículos con contenido editorial
- Sitios accesibles públicamente

### ⚠️ **Limitaciones:**
- No puede acceder a contenido de pago (paywalls)
- No analiza videos (solo texto)
- No puede verificar imágenes (aún)

### 🚀 **Mejoras Futuras Posibles:**
- Verificación de imágenes con Google Vision API
- Análisis de sentimiento
- Detección de clickbait
- Historial de verificaciones

---

## 🎓 Recursos de Aprendizaje

1. **`GROQ_API_SETUP.md`** → Cómo configurar Groq
2. **`GUIA_APIS_VERIFICACION.md`** → Documentación de APIs
3. **`EJEMPLO_USO_REAL.md`** → Casos de uso detallados
4. **`INICIO_RAPIDO.md`** → Inicio rápido

---

## 🎉 ¡Eso es Todo!

Ahora entiendes:
- ✅ Cómo extrae contenido (Jina AI)
- ✅ Cómo analiza con IA (Groq)
- ✅ Cómo verifica facts (Google)
- ✅ Cómo calcula credibilidad

**Siguiente paso:** Obtén tu Groq API key en https://console.groq.com/keys
