# 🚀 Guía de Inicio Rápido

## 📦 Paso 1: Instalar Dependencias

```bash
npm install
```

## 🔑 Paso 2: Configurar API Keys

### ⚡ APIs Necesarias (Ambas GRATIS)

#### 1. ✅ Google Fact Check API (YA LA TIENES)
Tu key actual: `AIzaSyCf-L2_V-aHob5qF6XAkIhU0izvOHhsMSI`
✅ Ya está configurada en tu `.env`

#### 2. 🚀 Groq API (NECESARIA para análisis con IA) ⭐⭐⭐
**¿Por qué Groq?**
- ✅ **100% GRATIS** sin tarjeta de crédito
- ✅ **Ultra rápido** (2-3 segundos)
- ✅ **Extrae y resume** contenido de noticias
- ✅ **Analiza veracidad** con IA avanzada (Llama 3.3 70B)
- ✅ **14,400 requests/día** gratis

**Obtener tu Groq API Key:**
1. Ve a: **https://console.groq.com/keys**
2. Regístrate con Google (30 segundos)
3. Crea una API key
4. Cópiala (se ve así: `gsk_xxxxxxxxxxxx`)
5. Pégala en tu `.env`

### Editar archivo .env

Abre el archivo `.env` y actualiza:

```env
# Ya tienes esta ✅
VITE_GOOGLE_FACTCHECK_API_KEY=AIzaSyCf-L2_V-aHob5qF6XAkIhU0izvOHhsMSI

# Agrega esta (obtenla en https://console.groq.com/keys)
VITE_GROQ_API_KEY=gsk_tu_key_aqui
```

**⚠️ IMPORTANTE:** 
- Reinicia el servidor después de agregar la key
- NO compartas este archivo ni lo subas a GitHub

**📖 Guía detallada:** Lee `GROQ_API_SETUP.md` para más info

## ▶️ Paso 3: Ejecutar el Proyecto

```bash
npm run dev
```

Abre tu navegador en: http://localhost:3000

## 🎯 Paso 4: Probar la Verificación

### Prueba 1: Noticia Real de La Jornada (Recomendada)
```
URL: https://www.jornada.com.mx/noticia/2025/11/24/mundo/trump-llena-los-medios-de-fake-news
```
**Lo que verás:**
- 📄 **Contenido extraído**: Título, autor, fecha, extracto
- 🧠 **Análisis con IA**: Resumen, afirmaciones, señales de alerta
- 🔍 **Fact-checks**: Verificaciones de Reuters, PolitiFact, etc.
- 📊 **Score**: 65-85 (Alta credibilidad - La Jornada es fuente confiable)

### Prueba 2: Noticia de Fuente Internacional
```
URL: https://www.bbc.com/news/
Resultado esperado: 85-95 (Alta credibilidad)
```

### Prueba 3: Búsqueda de Fake News Conocida
```
Buscar: "5g causa coronavirus"
```
**Lo que verás:**
- ❌ **Múltiples fact-checks** desmintiendo la afirmación
- ⚠️ **Señales de alerta** de la IA
- 📊 **Score bajo**: 10-25 (Información desmentida)

### ✅ Con Groq API configurada verás:
- 📄 **Extracción completa** del contenido
- 🧠 **Resumen automático** de la noticia
- 🎯 **Afirmaciones principales** identificadas
- ⚠️ **Señales de alerta** (si las hay)
- 💡 **Recomendación inteligente**
- 🔍 **Fact-checks** de Google
- 📊 **Score de credibilidad** 0-100

### ⚠️ Sin Groq API verás:
- 🔍 Solo fact-checks de Google
- 📊 Score básico basado en la fuente
- ⚠️ Funciona pero sin análisis de IA

## 📊 Interpretación de Resultados

| Puntuación | Color | Significado |
|------------|-------|-------------|
| 75-100 | 🟢 Verde | Alta credibilidad - Fuente confiable |
| 50-74 | 🟡 Amarillo | Credibilidad moderada - Verificar más |
| 0-49 | 🔴 Rojo | Baja credibilidad - Precaución |

## 🐛 Solución de Problemas

### Error: "Failed to fetch"
- ✅ Verifica que las API keys sean correctas
- ✅ Revisa que no hayas excedido los límites gratuitos
- ✅ Asegúrate de tener conexión a internet

### Error: "Mode demonstration"
- Esto es normal si no configuraste las API keys
- El sistema funciona pero con datos simulados

### El proyecto no inicia
```bash
# Limpia node_modules e reinstala
rm -rf node_modules
npm install
npm run dev
```

### API Key no funciona
- Verifica que el formato sea correcto en .env
- Asegúrate de reiniciar el servidor después de editar .env
- Verifica que no haya espacios extra al pegar las keys

## 📚 Próximos Pasos

1. **Personaliza el diseño** editando `src/components/VerificationBox.jsx`

2. **Agrega más APIs** editando `src/services/newsVerification.js`

3. **Mejora el algoritmo** modificando la función `calculateCredibilityScore()`

4. **Lee la documentación completa** en `VERIFICACION_NOTICIAS.md`

## 💡 Consejos Pro

- 🔄 Guarda tus búsquedas frecuentes para no gastar llamadas API
- 📱 Las APIs gratuitas se reinician cada 24 horas
- 🎯 Google Fact Check es la más útil para verificación
- 💾 Considera agregar un backend para cachear resultados

## 🆘 Ayuda

¿Problemas? Revisa:
- 📖 VERIFICACION_NOTICIAS.md - Documentación completa
- 💻 src/services/EJEMPLOS_USO.js - Ejemplos de código
- 🌐 Documentación de las APIs (enlaces en VERIFICACION_NOTICIAS.md)

---

**¡Listo! 🎉** Ahora tienes un sistema completo de verificación de noticias.
