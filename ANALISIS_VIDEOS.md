# 🎬 Análisis de Videos con IA

## ¿Cómo Funciona?

El análisis de videos funciona mediante la **extracción automática de frames** (capturas de pantalla) del video y el análisis individual de cada frame usando las mismas técnicas de detección de IA que se usan para imágenes.

### Proceso Paso a Paso

1. **Extracción de Frames** 📹
   - Se extraen automáticamente **5 frames** distribuidos uniformemente a lo largo del video
   - Los frames se capturan usando un elemento `<video>` y `<canvas>` en el navegador
   - Cada frame se convierte a imagen JPEG en base64

2. **Análisis Individual** 🔍
   - Cada frame se analiza con **dos motores de IA independientes** (OpenAI GPT-4o)
   - Se detectan señales de contenido generado por IA:
     - Situaciones imposibles o absurdas
     - Anatomía incorrecta
     - Iluminación perfecta no natural
     - Artefactos de generación por IA
     - Inconsistencias visuales

3. **Promedio y Veredicto** 📊
   - Se calcula el promedio de autenticidad de todos los frames
   - Se determina cuántos frames son IA vs. reales
   - El veredicto final se basa en la mayoría

### Resultados que Obtienes

#### Veredicto General
```
⚠️ CONTENIDO POSIBLEMENTE GENERADO POR IA (3/5 frames detectados)
o
✅ CONTENIDO PROBABLEMENTE REAL (4/5 frames auténticos)
```

#### Métricas
- **Score de Autenticidad** (0-100): Promedio de autenticidad de todos los frames
- **Confianza** (0-100%): Nivel de certeza del análisis
- **Frames Analizados**: Número total de frames procesados
- **IA vs Real**: Conteo de frames detectados como IA o reales

#### Análisis Detallado
- Descripción de cada frame analizado
- Lista completa de evidencias detectadas
- Análisis individual por frame con timestamp

### Ejemplo de Uso

```javascript
import { analyzeVideoWithAI } from '@/services/newsVerification';

// Analizar un video con callback de progreso
const result = await analyzeVideoWithAI(videoFile, (progress) => {
  if (progress.stage === 'extracting') {
    console.log('Extrayendo frames...');
  } else if (progress.stage === 'analyzing') {
    console.log(`Analizando frame ${progress.currentFrame}/${progress.totalFrames}`);
  } else if (progress.stage === 'complete') {
    console.log('Análisis completo!');
  }
});

console.log(result.verdict);
// "⚠️ CONTENIDO POSIBLEMENTE GENERADO POR IA (3/5 frames detectados)"

console.log(result.authenticityScore);
// 35

console.log(result.framesAnalyzed);
// 5

console.log(result.frameDetails);
// Array con análisis detallado de cada frame
```

### Interfaz de Usuario

#### Durante el Análisis
El usuario ve:
- Toast de notificación: "Analizando video..."
- Animación de carga
- Mensaje: "Extrayendo frames y analizando con IA"

#### Resultados Mostrados
1. **Veredicto Visual** con código de colores:
   - 🟢 Verde = Video auténtico
   - 🔴 Rojo = Video generado/editado con IA

2. **Tarjetas de Métricas**:
   - Score de autenticidad (0-100)
   - Nivel de confianza (%)
   - Estadísticas de frames

3. **Análisis de Frames**:
   - Descripción detallada de lo observado en cada frame
   - Lista de evidencias específicas
   - Análisis individual por frame con timestamp

4. **Detalles por Frame**:
   - Cada frame con su timestamp (ej: "2.5s")
   - Veredicto individual: 🤖 IA o 📸 Real
   - Scores individuales de autenticidad y confianza

### Limitaciones Actuales

- Se analizan **5 frames** por defecto (suficiente para videos cortos-medianos)
- El análisis toma tiempo (~5-15 segundos dependiendo del video)
- Videos muy cortos (<5 segundos) tendrán menos frames
- No se analiza el audio, solo contenido visual

### Mejoras Futuras Posibles

- [ ] Permitir configurar el número de frames a extraer
- [ ] Análisis de audio para detectar deepfakes de voz
- [ ] Detección de cortes/ediciones sospechosas
- [ ] Análisis de consistencia temporal entre frames
- [ ] Soporte para videos muy largos (>10 minutos)

---

## Tecnologías Utilizadas

- **HTML5 Video API**: Para cargar y reproducir el video
- **Canvas API**: Para capturar frames del video
- **FileReader API**: Para convertir blobs a base64
- **OpenAI GPT-4o Vision**: Para análisis de cada frame
- **Promesas JavaScript**: Para manejar operaciones asíncronas
- **React Hooks**: Para gestionar estado y UI

## Ventajas del Enfoque

✅ **No requiere backend**: Todo se procesa en el navegador
✅ **Análisis exhaustivo**: Múltiples frames dan mejor cobertura
✅ **Detección robusta**: Doble análisis de cada frame reduce falsos positivos
✅ **Progreso visible**: El usuario sabe qué está pasando en cada momento
✅ **Privacidad**: El video no se sube completo, solo frames individuales

## Consideraciones de Performance

- **Memoria**: Se procesan frames en secuencia, no todos a la vez
- **Red**: Solo se envían 5 imágenes JPEG comprimidas a la API
- **Tiempo**: ~1-3 segundos por frame (5-15 segundos total)
- **Costo**: 10 análisis de imagen por video (5 frames × 2 motores)
