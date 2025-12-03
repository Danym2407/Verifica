# 🔍 Guía de APIs para Verificación de Noticias

## API Recomendada Principal: Google Fact Check Tools API

### ¿Por qué usar Google Fact Check Tools API?

✅ **100% GRATUITA** - Sin límites de uso  
✅ **Busca en múltiples fact-checkers** - Snopes, PolitiFact, AFP, FactCheck.org, etc.  
✅ **Te dice si otros sitios verificaron la misma información**  
✅ **Muestra el rating de veracidad** (Verdadero, Falso, Parcialmente Falso, etc.)  
✅ **Fácil de usar** - Solo necesitas una API key gratuita  

---

## 🚀 Cómo Obtener tu Google Fact Check API Key

### Paso 1: Ir a Google Cloud Console
1. Ve a: https://console.cloud.google.com/
2. Inicia sesión con tu cuenta de Google
3. Crea un nuevo proyecto (o usa uno existente)

### Paso 2: Activar la API
1. En el menú, ve a **APIs y Servicios** → **Biblioteca**
2. Busca: **"Fact Check Tools API"**
3. Haz clic en **"HABILITAR"**

### Paso 3: Crear una API Key
1. Ve a **APIs y Servicios** → **Credenciales**
2. Haz clic en **"+ CREAR CREDENCIALES"**
3. Selecciona **"Clave de API"**
4. Copia tu API key (se verá algo como: `AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### Paso 4: Configurar en tu proyecto
1. Abre el archivo `.env` en la raíz de tu proyecto
2. Agrega tu API key:
```
VITE_GOOGLE_FACTCHECK_API_KEY=TU_API_KEY_AQUI
```
3. Guarda el archivo
4. Reinicia tu servidor de desarrollo

---

## 📊 Cómo Funciona

Cuando ingresas una URL o noticia, el sistema:

### 1️⃣ Extrae la información clave
```
URL: https://ejemplo.com/noticia-sobre-vacunas
→ Extrae: "noticia sobre vacunas"
```

### 2️⃣ Busca en Google Fact Check API
```
Consulta: "vacunas"
→ Google busca en todos los fact-checkers verificados
→ Encuentra: 15 verificaciones de diferentes fuentes
```

### 3️⃣ Analiza los resultados
```
Fuentes que verificaron:
- Snopes: FALSE ❌
- PolitiFact: Pants on Fire ❌
- AFP Fact Check: False ❌
- FactCheck.org: Misleading ⚠️

Consenso: 3 fuentes dicen "FALSO" → Baja credibilidad
```

### 4️⃣ Te muestra el resultado
```
Credibilidad: 25/100 ⚠️
Recomendación: BAJA CREDIBILIDAD - Información desmentida por múltiples verificadores
```

---

## 🎯 Ejemplo Real

### Entrada:
```
URL: https://ejemplo.com/5g-causa-covid
```

### Lo que hace la API:
1. Busca: "5g covid" en Google Fact Check
2. Encuentra verificaciones de:
   - **Reuters**: FALSE - "No hay evidencia de que 5G cause COVID"
   - **AP News**: FALSE - "Teoría conspiratoria desmentida"
   - **Full Fact**: FALSE - "Afirmación sin fundamento científico"

### Salida:
```json
{
  "credibilityScore": 15,
  "recommendation": {
    "level": "low",
    "message": "Baja credibilidad - Desmentido por múltiples fuentes verificadas"
  },
  "factChecks": [
    {
      "claim": "5G causa coronavirus",
      "rating": "FALSE",
      "source": "Reuters",
      "url": "https://reuters.com/..."
    }
  ]
}
```

---

## 🌐 APIs Complementarias (Opcionales)

### 2. NewsAPI.org
**Para encontrar fuentes que hablen del mismo tema**

- **Gratis**: 100 requests/día
- **Uso**: Buscar artículos similares de fuentes confiables
- **Obtener key**: https://newsapi.org/register

```env
VITE_NEWS_API_KEY=tu_news_api_key
```

### 3. Media Bias/Fact Check (Manual)
**Para conocer el sesgo de una fuente**

- Lista pública de credibilidad de medios
- No requiere API, puedes usar su base de datos
- Sitio: https://mediabiasfactcheck.com/

---

## 💡 Casos de Uso

### ✅ Caso 1: Verificar una noticia viral
```
Usuario ingresa: "https://facebook.com/post-viral-vacunas"
→ Sistema busca: "vacunas"
→ Encuentra: 20 fact-checks
→ Resultado: "Esta afirmación ha sido verificada por Snopes, PolitiFact y AFP"
```

### ✅ Caso 2: Confirmar información con fuentes similares
```
Usuario ingresa: "https://sitio-desconocido.com/elecciones-fraude"
→ Sistema busca: "elecciones fraude"
→ Encuentra: Reuters, AP verificaron el tema
→ Muestra: "Múltiples fuentes confiables desmienten esta afirmación"
```

### ✅ Caso 3: Fuente nueva sin historial
```
Usuario ingresa: "https://nuevo-blog.com/noticia"
→ No hay fact-checks previos
→ Sistema busca noticias similares en NewsAPI
→ Compara: ¿Medios confiables hablan de esto?
```

---

## 🎨 Lo que verá el usuario

```
┌─────────────────────────────────────────────┐
│  🔍 Resultados de Verificación              │
├─────────────────────────────────────────────┤
│                                             │
│  Credibilidad: ████████░░ 75/100           │
│                                             │
│  ✅ ALTA CREDIBILIDAD                       │
│  La información está respaldada por         │
│  múltiples fuentes verificadas             │
│                                             │
│  📊 Fact-Checks Encontrados:                │
│                                             │
│  ✓ Reuters (Verificado)                    │
│    "Afirmación confirmada por expertos"    │
│                                             │
│  ✓ AP News (Verificado)                    │
│    "Información precisa y documentada"     │
│                                             │
│  ⚠️ Snopes (Parcialmente Verdadero)        │
│    "Algunos detalles son imprecisos"       │
│                                             │
│  📰 Fuentes Relacionadas:                   │
│                                             │
│  • BBC News habló del tema                 │
│  • The Guardian tiene un artículo similar  │
│  • El País confirma la información         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Solución de Problemas

### Problema: "API key no configurada"
**Solución**: Verifica que el archivo `.env` tenga tu API key y reinicia el servidor

### Problema: "No se encontraron fact-checks"
**Solución**: Normal para noticias muy recientes o locales. El sistema aún analizará la fuente.

### Problema: "Error 403 - Forbidden"
**Solución**: Verifica que la API esté habilitada en Google Cloud Console

### Problema: "Límite de requests excedido"
**Solución**: Google Fact Check API es gratuita sin límites. Si usas NewsAPI, tienes límite de 100/día en plan gratuito.

---

## 📈 Próximos Pasos

1. ✅ **Obtén tu Google Fact Check API key** (gratis)
2. ✅ **Agrégala al archivo `.env`**
3. ✅ **Reinicia tu proyecto**
4. ✅ **Prueba con una noticia conocida** (ej: "vacunas causan autismo")
5. ✅ **Verás los fact-checks de Snopes, PolitiFact, etc.**

---

## 🎓 Recursos Adicionales

- **Google Fact Check Tools**: https://toolbox.google.com/factcheck/
- **Documentación API**: https://developers.google.com/fact-check/tools/api/reference/rest
- **NewsAPI**: https://newsapi.org/docs
- **Media Bias Chart**: https://adfontesmedia.com/

---

## ⚡ Ejemplo de Código

### Buscar fact-checks:
```javascript
const factChecks = await checkGoogleFactCheck("vacunas");
// Retorna array con todas las verificaciones de Snopes, PolitiFact, etc.
```

### Verificar URL completa:
```javascript
const result = await verifyNews("https://ejemplo.com/noticia");
// Retorna análisis completo con score de credibilidad
```

---

**¿Necesitas ayuda?** Revisa los archivos:
- `src/services/newsVerification.js` - Lógica de verificación
- `src/components/VerificationResults.jsx` - Interfaz de resultados
- `API_CONFIGURACION.md` - Guía detallada de configuración
