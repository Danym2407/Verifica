# 🚀 Cómo Obtener tu Groq API Key (GRATIS)

## ¿Qué es Groq?

Groq es una plataforma de IA **ULTRA RÁPIDA** y **COMPLETAMENTE GRATIS** que te permite analizar contenido con modelos de lenguaje avanzados como **Llama 3.3 70B**.

### ⚡ Ventajas de Groq:
- ✅ **100% GRATIS** - Sin tarjeta de crédito
- ✅ **Ultra rápido** - Respuestas en segundos
- ✅ **Límite generoso** - 14,400 requests/día (6,000 requests/min)
- ✅ **Modelos potentes** - Llama 3.3 70B, Mixtral, Gemma 2
- ✅ **Sin costos ocultos**

---

## 📋 Pasos para Obtener tu API Key

### **Paso 1: Ir a Groq Console**
1. Abre tu navegador
2. Ve a: **https://console.groq.com/**
3. Haz clic en **"Sign in"** o **"Start Building"**

---

### **Paso 2: Crear una Cuenta**
Puedes registrarte con:
- 🔵 **Cuenta de Google** (recomendado - más rápido)
- 🔷 **Cuenta de GitHub**
- 📧 **Email y contraseña**

**NO necesitas tarjeta de crédito ni información de pago**

---

### **Paso 3: Verificar tu Email** (si usas email)
1. Revisa tu bandeja de entrada
2. Haz clic en el link de verificación
3. Regresa a Groq Console

---

### **Paso 4: Crear tu API Key**
1. Una vez dentro, ve a: **https://console.groq.com/keys**
2. Haz clic en **"Create API Key"**
3. Dale un nombre a tu key (ejemplo: `"Verificador-Noticias"`)
4. Haz clic en **"Submit"**
5. **¡IMPORTANTE!** Copia tu API key inmediatamente
   - Se verá algo así: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Guárdala bien** - Solo la verás una vez

---

### **Paso 5: Configurarla en tu Proyecto**

1. Abre el archivo `.env` en tu proyecto
2. Pega tu API key en la línea de `VITE_GROQ_API_KEY`:

```env
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Guarda el archivo (Ctrl + S)
4. Reinicia tu servidor:
   - Ve a la terminal de Vite
   - Presiona `Ctrl + C`
   - Ejecuta: `npm run dev`

---

## ✅ ¡Listo! Ahora tu Verificador Puede:

### 📄 **Extraer Contenido Completo**
```
URL: https://jornada.com.mx/noticia/...
↓
Extrae: Título, autor, fecha, contenido completo
```

### 🧠 **Analizar con IA**
La IA te dirá:
- ✅ **Resumen** - ¿De qué trata la noticia?
- ✅ **Afirmaciones principales** - ¿Qué claims hace?
- ✅ **Score de credibilidad** - ¿Qué tan creíble es?
- ✅ **Señales de alerta** - ¿Hay banderas rojas?
- ✅ **Recomendación** - ¿Deberías confiar en ella?

### 🔍 **Verificar con Fact-Checkers**
- Busca en Google Fact Check API
- Encuentra verificaciones de Reuters, Snopes, AFP
- Compara con otras fuentes

---

## 🎯 Ejemplo Real con La Jornada

### **Input:**
```
URL: https://www.jornada.com.mx/noticia/2025/11/24/mundo/trump-llena-los-medios-de-fake-news
```

### **Output que verás:**

```
┌──────────────────────────────────────────┐
│  📄 CONTENIDO EXTRAÍDO                   │
├──────────────────────────────────────────┤
│  Título: Trump llena los medios de...   │
│  Autor: La Jornada                       │
│  Fecha: 24 de noviembre, 2025            │
│                                          │
│  Extracto: [Primeros 500 caracteres]    │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  🧠 ANÁLISIS CON IA                      │
├──────────────────────────────────────────┤
│  📝 Resumen:                             │
│  El artículo analiza cómo el expresi-    │
│  dente Trump ha utilizado desinforma-    │
│  ción en medios...                       │
│                                          │
│  🎯 Afirmaciones Principales:            │
│  • Trump ha difundido fake news          │
│  • Los medios replican información       │
│    sin verificar                         │
│                                          │
│  ⚠️ Señales de Alerta:                   │
│  • Lenguaje con carga política           │
│  • Falta de fuentes primarias            │
│                                          │
│  💡 Recomendación:                       │
│  Verificar con múltiples fuentes antes   │
│  de compartir. Fuente conocida pero      │
│  artículo de opinión.                    │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  ✅ VERIFICACIONES DE FACT-CHECKERS      │
├──────────────────────────────────────────┤
│  Reuters: "Trump fake news claims"       │
│  Rating: MIXED                           │
│                                          │
│  PolitiFact: Similar claims verified    │
│  Rating: MOSTLY FALSE                    │
└──────────────────────────────────────────┘

Credibilidad Final: 68/100
```

---

## 🎓 Límites de Groq (Gratis)

| Modelo | Requests/Min | Requests/Día | Tokens/Min |
|--------|--------------|--------------|------------|
| Llama 3.3 70B | 30 | 14,400 | 20,000 |
| Llama 3.1 70B | 30 | 14,400 | 20,000 |
| Mixtral 8x7B | 30 | 14,400 | 20,000 |

**¿Es suficiente?** ¡SÍ! Con 14,400 requests/día puedes verificar miles de noticias.

---

## 🔧 Solución de Problemas

### ❌ Error: "API key no configurada"
**Solución:** 
- Verifica que copiaste la key completa
- Debe empezar con `gsk_`
- No debe tener espacios ni saltos de línea

### ❌ Error: "Invalid API key"
**Solución:**
- Ve a https://console.groq.com/keys
- Revoca la key antigua
- Crea una nueva
- Actualiza el archivo `.env`

### ❌ Error: "Rate limit exceeded"
**Solución:**
- Estás haciendo demasiadas requests muy rápido
- Espera unos segundos entre verificaciones
- El límite es 30 requests por minuto

### ❌ No veo el análisis de IA
**Solución:**
1. Verifica que guardaste el archivo `.env`
2. Reinicia el servidor (Ctrl+C → npm run dev)
3. Limpia la caché del navegador (Ctrl+Shift+R)

---

## 📊 ¿Qué hace la IA exactamente?

### 1. **Lee el Contenido**
```javascript
// Jina AI extrae el texto limpio
Título: "Trump llena los medios de fake news"
Contenido: [Todo el artículo en texto plano]
```

### 2. **Analiza con Groq**
```javascript
// La IA procesa el contenido
Prompt: "Analiza esta noticia y evalúa su credibilidad..."
→ Groq (Llama 3.3 70B) procesa
→ Genera análisis en 2-3 segundos
```

### 3. **Devuelve Resultado Estructurado**
```json
{
  "summary": "Resumen conciso de 2-3 oraciones",
  "mainClaims": ["Afirmación 1", "Afirmación 2"],
  "credibilityScore": 75,
  "redFlags": ["Lenguaje sensacionalista"],
  "recommendation": "Verificar con otras fuentes"
}
```

---

## 🚀 Próximos Pasos

1. ✅ **Obtén tu Groq API key** → https://console.groq.com/keys
2. ✅ **Pégala en tu archivo `.env`**
3. ✅ **Reinicia el servidor**
4. ✅ **Prueba con la noticia de La Jornada**
5. ✅ **Verás resumen, análisis y verificaciones**

---

## 💰 Costo Total: $0.00 USD

| Servicio | Costo | Límite |
|----------|-------|--------|
| Jina AI Reader | GRATIS | Ilimitado |
| Groq API | GRATIS | 14,400/día |
| Google Fact Check | GRATIS | Ilimitado |
| **TOTAL** | **$0.00** | **Suficiente para miles de verificaciones** |

---

## 🎉 ¡Ya Tienes un Verificador Profesional!

Tu aplicación ahora puede:
- 📄 Extraer contenido completo de cualquier URL
- 🧠 Analizar veracidad con IA avanzada
- 🔍 Verificar con múltiples fact-checkers
- 📊 Generar reportes detallados
- ⚡ Todo en segundos y GRATIS

---

**¿Listo para probarlo?** 🚀

1. Obtén tu key: https://console.groq.com/keys
2. Agrégala al `.env`
3. Reinicia el servidor
4. ¡Verifica tu primera noticia!
