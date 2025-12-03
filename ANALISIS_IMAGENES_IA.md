# 🖼️ Análisis de Imágenes con IA

## Descripción General

El sistema ahora incluye **análisis de imágenes** para detectar si una imagen es **real/auténtica** o **generada con Inteligencia Artificial**. Esta funcionalidad ayuda a identificar contenido visual manipulado o creado artificialmente.

---

## 🎯 Características del Análisis

### ¿Qué detecta?

1. **Imagen Real vs IA Generada**
   - Determina si una imagen es una fotografía auténtica o fue creada con herramientas de IA (Midjourney, DALL-E, Stable Diffusion, etc.)

2. **Señales de IA**
   - Manos deformadas o dedos extraños
   - Texto distorsionado o ilegible
   - Patrones repetitivos artificiales
   - Bordes poco naturales

3. **Signos de Manipulación**
   - Ediciones con Photoshop
   - Iluminación inconsistente
   - Sombras que no coinciden
   - Deepfakes o alteraciones digitales

4. **Calidad de Imagen**
   - Alta / Media / Baja
   - Resolución y características técnicas

5. **Contexto**
   - Descripción de qué muestra la imagen
   - Elementos presentes en la escena

---

## 🚀 Cómo Usar

### Opción 1: Análisis Solo de Imagen

```
1. Ve a la página principal
2. Haz clic en "Subir imagen"
3. Selecciona una imagen (JPG, PNG, etc.)
4. NO escribas ningún link
5. Haz clic en "Verificar contenido"
```

El sistema analizará **solo la imagen** y te dirá:
- ✅ Si es real o generada con IA
- 📊 Puntuación de autenticidad (0-100)
- 🔍 Señales detectadas
- 💡 Recomendación final

### Opción 2: Link + Imagen (Verificación Completa)

```
1. Escribe un link de noticia
2. Además, sube una imagen relacionada
3. Haz clic en "Verificar contenido"
```

El sistema analizará:
- 📰 La credibilidad del artículo
- 🖼️ La autenticidad de la imagen
- 🔗 Relación entre ambos

---

## 📊 Interpretación de Resultados

### Imagen Real/Auténtica ✅

```
🎯 Resultado: 📸 Imagen Real/Auténtica
Confianza: 92% | Autenticidad: 88/100

✓ Sin señales de IA detectadas
✓ Iluminación natural consistente
✓ Sombras correctas
✓ Calidad: Alta
```

**Recomendación**: La imagen parece auténtica, proviene de una fuente real.

### Imagen Generada con IA 🤖

```
🎯 Resultado: 🤖 Imagen Generada con IA
Confianza: 85% | Autenticidad: 35/100

⚠️ Señales de IA Detectadas:
- Manos con dedos deformados
- Texto ilegible en el fondo
- Patrones repetitivos artificiales
- Transiciones poco naturales

⚠️ Signos de Manipulación:
- Iluminación inconsistente
- Bordes difuminados artificialmente
```

**Recomendación**: Esta imagen fue generada o manipulada con IA. Verificar fuente original.

---

## 🔧 Tecnología Utilizada

### Groq Vision API (Llama 3.2 90B Vision)

- **Modelo**: `llama-3.2-90b-vision-preview`
- **Proveedor**: Groq (Ultra-rápido)
- **Costo**: ✅ **GRATIS** (límite de requests)
- **Características**:
  - Análisis visual avanzado
  - Detección de patrones de IA
  - Reconocimiento de contexto
  - Explicación detallada

### ¿Cómo funciona?

1. **Conversión**: La imagen se convierte a formato base64
2. **Envío**: Se envía al modelo de visión Llama 3.2
3. **Análisis**: La IA examina:
   - Características visuales
   - Patrones típicos de IA
   - Inconsistencias físicas
   - Metadatos y calidad
4. **Respuesta**: Devuelve JSON con:
   - `isAIGenerated`: true/false
   - `confidence`: % de confianza
   - `authenticityScore`: 0-100
   - `aiSignals`: array de señales
   - `manipulationSigns`: array de manipulaciones
   - `imageQuality`: alta/media/baja
   - `context`: descripción
   - `recommendation`: consejo final

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Noticia con Imagen Sospechosa

**Escenario**: Encuentras una noticia que parece tener una imagen falsa

```
Link: https://ejemplo.com/noticia-importante
Imagen: [subir imagen sospechosa]

Resultado:
- Artículo: 75/100 credibilidad (fuente confiable)
- Imagen: 🤖 Generada con IA (30/100 autenticidad)
- ⚠️ Alerta: Aunque el artículo es de fuente confiable, 
  la imagen adjunta fue generada con IA
```

### Ejemplo 2: Solo Verificar una Imagen de Redes Sociales

**Escenario**: Alguien comparte una imagen viral en redes sociales

```
Link: [dejar vacío]
Imagen: [subir imagen viral]

Resultado:
- 🤖 Imagen Generada con IA
- Confianza: 88%
- Señales: Manos con 6 dedos, texto borroso
- Recomendación: No compartir, es contenido fabricado
```

### Ejemplo 3: Verificar Foto de Prensa

**Escenario**: Verificar una foto de un medio de comunicación

```
Link: https://nmas.com.mx/foto-evento
Imagen: [subir foto del evento]

Resultado:
- Artículo: 85/100 credibilidad (N+ Media)
- Imagen: ✅ Real/Auténtica (92/100)
- ✓ Sin manipulación detectada
- Calidad: Alta
```

---

## ⚙️ Configuración

### API Key Requerida

En tu archivo `.env`:

```env
VITE_GROQ_API_KEY=tu_api_key_de_groq_aqui
```

Ya tienes esta configurada ✅

### Límites

- **Tamaño máximo**: Depende del navegador (generalmente ~10MB)
- **Formatos soportados**: JPG, PNG, GIF, WebP
- **Requests**: Límite del plan gratuito de Groq

---

## 🎨 Visualización en la App

### Sección de Resultados

Cuando analizas una imagen, verás:

1. **Tarjeta de Análisis** (roja o verde según resultado)
   - 🤖 Roja = Generada con IA
   - 📸 Verde = Real/Auténtica

2. **Estadísticas**
   - Confianza (%)
   - Puntuación de autenticidad (0-100)

3. **Detalles**
   - 🔍 Contexto de la imagen
   - 🚨 Señales de IA detectadas
   - ⚠️ Signos de manipulación
   - 📊 Calidad de imagen
   - 💡 Recomendación final

---

## 🔍 Limitaciones

### Lo que SÍ puede detectar:
- ✅ Imágenes generadas con IA moderna (2022+)
- ✅ Manipulaciones evidentes (Photoshop, deepfakes)
- ✅ Inconsistencias físicas (manos, texto, sombras)
- ✅ Patrones típicos de generadores (Midjourney, DALL-E, Stable Diffusion)

### Lo que NO puede garantizar:
- ❌ Detección 100% precisa (ningún sistema es perfecto)
- ❌ Imágenes IA muy refinadas o editadas posteriormente
- ❌ Fotografías reales con edición profesional pueden dar falsos positivos
- ❌ Imágenes de muy baja calidad dificultan el análisis

### Recomendaciones de uso:
- 💡 Úsalo como **herramienta complementaria**, no como veredicto final
- 🔍 Combina con otras fuentes de verificación
- 📊 Considera el contexto y la fuente original
- 🤝 En casos críticos, consulta con expertos en verificación de medios

---

## 🚀 Próximas Mejoras

- [ ] Análisis de videos (detectar deepfakes en video)
- [ ] Historial de análisis de imágenes
- [ ] Comparación con base de datos de imágenes conocidas
- [ ] Detección de metadatos EXIF manipulados
- [ ] Integración con servicios especializados (Google Vision, AWS Rekognition)

---

## 📚 Referencias

- **Groq API**: https://groq.com
- **Llama Vision**: https://www.llama.com/llama-downloads
- **Técnicas de detección de IA**: [Investigación reciente sobre detección de imágenes sintéticas]

---

¡Ahora puedes verificar tanto **noticias** como **imágenes** para detectar contenido falso o manipulado! 🎉
