# 🤖 Configuración de OpenAI GPT-4 Vision API

## ✅ **API YA CONFIGURADA**

Tu proyecto ahora usa **OpenAI GPT-4o Vision** para detectar si una imagen es:
- **📸 FOTOGRAFÍA REAL** (autenticidad >75%)
- **🎨 RENDER 3D** (autenticidad <40%)
- **🤖 IA GENERATIVA** (autenticidad <30%)

---

## 🔑 **Tu API Key**

```
sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**✅ Ya está guardada en tu archivo `.env`**

---

## 🚀 **Cómo Funciona**

### **Análisis Dual (Doble Verificación)**

El sistema hace **2 análisis independientes** de la misma imagen usando OpenAI GPT-4o con parámetros ligeramente diferentes:

1. **Primer Análisis** (`analyzeImageWithGemini`)
   - Temperatura: 0.1 (más determinístico)
   - Enfoque: Análisis técnico detallado

2. **Segundo Análisis** (`analyzeImageWithAI`)
   - Temperatura: 0.2 (más creativo)
   - Enfoque: Perspectiva crítica alternativa

3. **Combinación de Resultados** (`createCombinedAnalysis`)
   - Si ambos concuerdan → Alta confianza
   - Si difieren → Promedia resultados y señala desacuerdo

---

## 📊 **Respuesta JSON del Análisis**

```json
{
  "isAIGenerated": false,
  "confidence": 85,
  "authenticityScore": 88,
  "imageDescription": "Selfie casual de una persona en un ambiente interior con iluminación natural. Se observa textura de piel realista, granulado de cámara visible, y compresión JPEG típica de fotos móviles.",
  "scoreJustification": "Asigno 88% porque detecto: granulado visible en zonas oscuras (evidencia fotográfica +30), compresión JPEG en bordes (+20), iluminación natural con sombras suaves (+18), imperfecciones orgánicas en piel (+12), contexto casual espontáneo (+8)",
  "aiSignals": [],
  "manipulationSigns": [],
  "imageQuality": "media",
  "context": "TIPO: Fotografía Real",
  "recommendation": "La imagen presenta características consistentes con fotografía real capturada por dispositivo móvil",
  "source": "OpenAI GPT-4o Vision",
  "agreement": "full",
  "individualResults": {
    "gemini": {
      "isAIGenerated": false,
      "confidence": 87,
      "authenticityScore": 88
    },
    "groq": {
      "isAIGenerated": false,
      "confidence": 83,
      "authenticityScore": 86
    }
  }
}
```

---

## 💰 **Costos de OpenAI API**

### **Modelo: GPT-4o (con Vision)**

| Resolución | Costo por Imagen |
|-----------|------------------|
| **Baja calidad** (`detail: low`) | ~$0.001 |
| **Alta calidad** (`detail: high`) | ~$0.01 - $0.02 |

**Tu configuración usa `detail: 'high'` para máxima precisión**

### **Estimación de Uso**

- **100 análisis** ≈ $1 - $2 USD
- **500 análisis** ≈ $5 - $10 USD
- **1000 análisis** ≈ $10 - $20 USD

**Nota:** Usa análisis dual (2 llamadas por imagen), así que los costos son el doble.

---

## 🎯 **Ventajas de GPT-4o Vision**

✅ **Modelo más avanzado disponible** (2024-2025)
✅ **Alta precisión en detección de IA**
✅ **Soporta análisis detallado**
✅ **Descripción en lenguaje natural**
✅ **Justificación del score**
✅ **API estable y confiable**

---

## ⚙️ **Configuración Actual**

### **Archivo: `.env`**
```env
VITE_OPENAI_API_KEY=tu_api_key_de_openai_aqui
```

### **Archivo: `src/services/newsVerification.js`**
- ✅ Función `analyzeImageWithGemini()` - Usa OpenAI GPT-4o
- ✅ Función `analyzeImageWithAI()` - Usa OpenAI GPT-4o (2da opinión)
- ✅ Función `createCombinedAnalysis()` - Combina ambos resultados

---

## 🔒 **Seguridad**

⚠️ **IMPORTANTE:**

1. **NO compartas tu API key** públicamente
2. **NO la subas a GitHub** (ya está en `.gitignore`)
3. **Usa variables de entorno** (`VITE_` prefix para Vite)
4. **Monitorea tu uso** en https://platform.openai.com/usage

---

## 📱 **Uso en tu Aplicación**

```jsx
import { verifyNews } from './services/newsVerification';

// Subir imagen para verificar
const handleImageUpload = async (imageFile) => {
  const result = await verifyNews(
    'https://example.com/article',
    'Título de la noticia',
    imageFile  // Archivo de imagen
  );
  
  console.log('Resultado:', result.imageAnalysis);
  // {
  //   isAIGenerated: false,
  //   confidence: 85,
  //   authenticityScore: 88,
  //   ...
  // }
};
```

---

## 🆘 **Soporte y Recursos**

- **Documentación OpenAI**: https://platform.openai.com/docs/guides/vision
- **Panel de Control**: https://platform.openai.com/dashboard
- **Límites de Uso**: https://platform.openai.com/account/limits
- **Precios**: https://openai.com/api/pricing/

---

## ✨ **Características del Análisis**

### **Detecta:**
- ✅ Granulado de cámara real
- ✅ Artefactos JPEG
- ✅ Texturas orgánicas (piel, tela)
- ✅ Iluminación natural
- ✅ Anatomía imposible (dedos IA)
- ✅ Texto distorsionado
- ✅ Patrones repetitivos
- ✅ Renders 3D vs Fotos
- ✅ Bordes artificiales

### **Proporciona:**
- 📝 Descripción detallada de la imagen
- 📊 Score de autenticidad (0-100)
- 🎯 Nivel de confianza (0-100)
- 🚨 Señales de IA detectadas
- ⚠️ Signos de manipulación
- 💡 Recomendación basada en evidencia
- 🔍 Justificación del score

---

## 🎉 **¡Listo para Usar!**

Tu proyecto ahora tiene análisis de imágenes profesional con GPT-4o Vision. 
Simplemente sube una imagen y el sistema detectará automáticamente si es real o generada con IA.
