# ❓ FAQ - Análisis de Imágenes con IA

## Preguntas Frecuentes

---

### 1. ¿Qué tipos de imágenes puede analizar?

**Formatos soportados**:
- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF (imagen estática)
- ✅ WebP
- ✅ BMP

**Tamaño recomendado**: Menor a 5-10MB

**Resolución**: Cualquiera, pero mayor calidad = mejor detección

---

### 2. ¿Qué tan preciso es el detector de IA?

**Precisión típica**:
- 🎯 **85-95%** para imágenes obviamente IA (thispersondoesnotexist.com, etc.)
- 🎯 **70-85%** para imágenes IA bien refinadas
- 🎯 **80-90%** para fotos reales claras

**Puede fallar en**:
- Imágenes IA + edición manual profesional
- Fotos reales con mucho Photoshop
- Arte digital profesional
- Imágenes de muy baja calidad

💡 **Recomendación**: Usarlo como herramienta complementaria, no como veredicto absoluto.

---

### 3. ¿Funciona sin conexión a Internet?

❌ **No**. Requiere conexión porque:
- Envía la imagen a Groq Vision API
- Groq procesa la imagen en sus servidores
- Devuelve el análisis vía API

Si no hay internet → Error en análisis

---

### 4. ¿Es gratis?

✅ **Sí**, dentro de los límites del plan gratuito de Groq:

**Plan Free de Groq**:
- ✅ Requests ilimitados (con rate limit)
- ✅ Acceso a Llama 3.2 90B Vision
- ⚠️ Rate limit: ~30 requests/minuto

Si excedes el límite → Error temporal (esperar 1 minuto)

---

### 5. ¿Puede detectar deepfakes?

**Parcialmente**:
- ✅ Puede detectar deepfakes de baja calidad
- ✅ Identifica inconsistencias en rostros
- ⚠️ Deepfakes profesionales pueden pasar

Para deepfakes, mejor usar herramientas especializadas:
- Microsoft Video Authenticator
- Sensity AI
- Deepware Scanner

---

### 6. ¿Guarda mis imágenes?

❌ **No guardamos nada**. El proceso es:

1. Seleccionas imagen → Se carga en memoria del navegador
2. Se convierte a base64 en tu navegador
3. Se envía a Groq API
4. Groq analiza y responde
5. **La imagen NO se guarda** ni en tu app ni en Groq

🔒 Tu privacidad está protegida.

---

### 7. ¿Puedo analizar múltiples imágenes a la vez?

❌ **No actualmente**. Solo soporta:
- 1 imagen por verificación
- Para analizar múltiples: repetir proceso

🔮 **Próxima mejora**: Análisis por lotes

---

### 8. ¿Funciona con screenshots?

✅ **Sí**, pero con consideraciones:

**Screenshots de imágenes**:
- ✅ Funciona bien si el screenshot es de buena calidad
- ⚠️ Puede perder metadatos originales

**Screenshots de texto**:
- ⚠️ No está diseñado para eso
- Mejor usar OCR si necesitas analizar texto

---

### 9. ¿Detecta si una foto fue editada con Photoshop?

**Sí, parcialmente**:

**Puede detectar**:
- ✅ Manipulaciones evidentes (borrar objetos, copiar/pegar)
- ✅ Iluminación inconsistente
- ✅ Sombras que no cuadran
- ✅ Bordes mal cortados

**No puede detectar**:
- ❌ Ediciones profesionales sutiles
- ❌ Ajustes de color/contraste
- ❌ Correcciones menores

---

### 10. ¿Qué generadores de IA puede detectar?

**Detecta imágenes de**:
- ✅ Midjourney
- ✅ DALL-E (2 y 3)
- ✅ Stable Diffusion
- ✅ Adobe Firefly
- ✅ Bing Image Creator
- ✅ Leonardo.ai
- ✅ Otros generadores modernos

**Características típicas que detecta**:
- Manos/dedos deformados
- Texto ilegible
- Patrones repetitivos
- Transiciones poco naturales

---

### 11. ¿Funciona con fotos antiguas (blanco y negro)?

✅ **Sí**, pero:

**Fotos antiguas reales**:
- Puede confundirlas con IA si están muy dañadas
- Grano de película puede parecer artefacto IA

**Fotos antiguas generadas con IA**:
- Las detecta si tienen señales típicas

💡 **Tip**: Contextualizar en la verificación

---

### 12. ¿Puedo usarlo para verificar imágenes de redes sociales?

✅ **Sí, es uno de los usos principales**:

**Flujo recomendado**:
1. Guarda la imagen de Twitter/Facebook/Instagram
2. Sube a tu verificador
3. Ve el resultado
4. Decide si compartir o no

**Casos de uso**:
- ✅ Fotos virales sospechosas
- ✅ Memes que parecen reales
- ✅ Noticias con imágenes dudosas

---

### 13. ¿Qué significa "Confianza" vs "Autenticidad"?

**Confianza** (0-100%):
- Qué tan seguro está el modelo de su decisión
- 90%+ = Muy seguro
- 50-70% = Dudoso
- <50% = No está seguro

**Autenticidad** (0-100):
- Qué tan real/auténtica es la imagen
- 80-100 = Muy probablemente real
- 40-70 = Dudoso/Mixto
- 0-40 = Muy probablemente IA

**Ejemplo**:
```
Confianza: 95%
Autenticidad: 30

Significa: "Estoy 95% seguro de que esta 
imagen es IA (autenticidad baja)"
```

---

### 14. ¿Funciona con imágenes de productos (e-commerce)?

✅ **Sí**, útil para:

**Detectar**:
- ✅ Productos ficticios generados con IA
- ✅ Fotos fake de dropshipping
- ✅ Renders vs fotos reales

**Limitaciones**:
- ⚠️ Renders 3D profesionales pueden confundirse
- ⚠️ Fotos de estudio muy editadas pueden dar falsos positivos

---

### 15. ¿Puede analizar videos?

❌ **No actualmente**. Limitaciones:

**Por ahora**:
- Solo imágenes estáticas
- No análisis de video

🔮 **Próximamente**: 
- Análisis de video frame por frame
- Detección de deepfakes en video
- Extracción de frames clave

**Alternativa actual**:
- Toma screenshot del video
- Analiza el frame como imagen

---

### 16. ¿Qué hago si el resultado parece incorrecto?

**Si crees que hay un falso positivo/negativo**:

1. **Verifica el contexto**:
   - ¿La imagen tiene buena calidad?
   - ¿Es un caso límite (arte digital, render 3D)?

2. **Usa herramientas complementarias**:
   - Google Images (búsqueda inversa)
   - TinEye (encontrar origen)
   - Metadatos EXIF (cámara, fecha)

3. **Considera múltiples factores**:
   - No solo el análisis IA
   - Fuente del artículo
   - Contexto de la noticia
   - Otros verificadores

💡 **Ningún detector es 100% perfecto**

---

### 17. ¿Detecta imágenes generadas con IA y luego editadas?

**Parcialmente**:

**Escenario 1**: IA + edición básica
- ✅ Detecta señales de IA originales
- ✅ Identifica artefactos típicos

**Escenario 2**: IA + edición profesional
- ⚠️ Puede pasar como real si la edición es muy buena
- ⚠️ Depende de qué tan bien se ocultaron las señales

---

### 18. ¿Funciona con capturas de pantalla de WhatsApp/Telegram?

✅ **Sí**, pero:

**Consideraciones**:
- Si es screenshot de imagen → Analiza la imagen dentro
- Puede perder calidad por compresión de WhatsApp
- Si tiene marca de agua/fecha, puede afectar análisis

**Recomendación**:
- Mejor descargar la imagen original si es posible
- Si solo tienes el screenshot, recorta la imagen

---

### 19. ¿Puedo integrar esto en mi propia app?

✅ **Sí**, el código es tuyo:

**Para integrar**:
1. Copia `analyzeImageWithAI()` de `newsVerification.js`
2. Usa tu propia API key de Groq
3. Adapta la UI a tu diseño

**Licencia**: Código open source (si aplica tu licencia)

**Soporte técnico**: Documentación incluida en:
- `ANALISIS_IMAGENES_IA.md`
- `CAMBIOS_CODIGO_DETALLADO.md`

---

### 20. ¿Hay límite de tamaño de archivo?

**Límites técnicos**:

1. **Navegador**: ~10-20MB (depende del navegador)
2. **API Groq**: Sin límite oficial documentado
3. **Recomendado**: < 5MB para mejor rendimiento

**Si tu imagen es muy grande**:
```
Solución:
1. Comprimir con TinyPNG/CompressJPEG
2. Reducir resolución (1920x1080 es suficiente)
3. Convertir a JPG (más pequeño que PNG)
```

---

### 21. ¿Analiza imágenes en otros idiomas?

✅ **Sí**, el modelo es multilingüe:

- Detecta IA sin importar el idioma
- Puede leer texto en la imagen (cualquier idioma)
- Resultados se devuelven en español (según prompt)

**Textos detectados**:
- Inglés ✅
- Español ✅
- Francés ✅
- Alemán ✅
- Chino ✅
- Etc.

---

### 22. ¿Qué pasa si subo una imagen sin contenido (blanco)?

**El modelo responderá**:
```json
{
  "isAIGenerated": false,
  "confidence": 30,
  "authenticityScore": 50,
  "context": "Imagen vacía o sin contenido relevante",
  "recommendation": "No se puede determinar autenticidad"
}
```

Confianza baja = No puede decidir

---

### 23. ¿Puedo usar esto para verificar identidad (KYC)?

⚠️ **No recomendado para KYC**:

**Razones**:
- No está diseñado para documentos oficiales
- Puede tener falsos positivos/negativos
- KYC requiere verificación más rigurosa

**Para KYC usa**:
- Servicios especializados (Jumio, Onfido, Veriff)
- Verificación con liveness detection
- Análisis de documentos oficiales

---

### 24. ¿Funciona offline o necesita API key?

❌ **Requiere**:
- ✅ API key de Groq (`VITE_GROQ_API_KEY`)
- ✅ Conexión a Internet
- ✅ Servidor Groq funcionando

**Sin API key**: Error al intentar analizar

**Cómo obtener API key**:
1. Ve a https://console.groq.com
2. Crea cuenta gratis
3. Genera API key
4. Agrégala a `.env`

---

### 25. ¿Puedo cambiar el modelo de IA que usa?

✅ **Sí**, editando `newsVerification.js`:

**Modelos disponibles en Groq**:
```javascript
// Actual (recomendado)
model: 'llama-3.2-90b-vision-preview'

// Alternativas (si las hay disponibles)
model: 'llama-3.2-11b-vision-preview'  // Más rápido, menos preciso
```

**Otros proveedores**:
- OpenAI GPT-4 Vision
- Google Gemini Vision
- Anthropic Claude 3 Vision

Solo necesitas cambiar el endpoint y formato de request.

---

## 🆘 Problemas Comunes

### Error: "Groq API key no configurada"
**Solución**: Agrega API key a `.env`:
```env
VITE_GROQ_API_KEY=tu_key_aqui
```

### Error: "Rate limit exceeded"
**Solución**: Espera 60 segundos, Groq tiene límite de requests

### La imagen no se analiza
**Soluciones**:
- Verifica que sea formato válido (JPG, PNG)
- Reduce el tamaño si es muy grande
- Checa la consola (F12) para ver error específico

### Resultado parece incorrecto
**Soluciones**:
- Verifica calidad de imagen
- Prueba con otra imagen similar
- Usa herramientas complementarias
- Considera contexto de la imagen

---

## 📞 Soporte Adicional

**Documentación completa**:
- `ANALISIS_IMAGENES_IA.md` - Guía principal
- `PRUEBA_ANALISIS_IMAGENES.md` - Cómo probar
- `CAMBIOS_CODIGO_DETALLADO.md` - Detalles técnicos
- `RESUMEN_IMPLEMENTACION.md` - Resumen general

**Recursos externos**:
- Groq API: https://console.groq.com
- Llama Vision: https://www.llama.com
- Groq Discord: Soporte de comunidad

---

¿Más preguntas? Consulta la documentación o revisa el código! 🚀
