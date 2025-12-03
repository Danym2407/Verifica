# 🧪 Prueba Rápida: Análisis de Imágenes

## Cómo Probar la Nueva Funcionalidad

### 1️⃣ Preparar Imágenes de Prueba

#### Opción A: Descargar Imágenes de IA
Busca en Google:
```
"AI generated images obvious" site:reddit.com
"midjourney fails"
"DALL-E artifacts"
"stable diffusion hands"
```

O visita:
- https://thispersondoesnotexist.com (personas IA)
- https://thisxdoesnotexist.com (varios objetos IA)

#### Opción B: Usar Fotos Reales
- Toma una foto con tu celular
- Descarga fotos de bancos de imágenes reales (Unsplash, Pexels)
- Usa fotos de noticias verificadas

---

### 2️⃣ Iniciar el Proyecto

```powershell
# Navegar al proyecto
cd "c:\Users\danym\Documents\Programación Web\PLANTILLA HOSTINGER\PLANTILLA 1"

# Instalar dependencias (si no lo has hecho)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre el navegador en: `http://localhost:5173`

---

### 3️⃣ Probar Solo Análisis de Imagen

**Caso 1: Imagen Generada con IA**
```
1. NO escribas ningún link
2. Haz clic en "Subir imagen"
3. Selecciona una imagen de thispersondoesnotexist.com
4. Clic en "Verificar contenido"
5. Espera ~5-10 segundos

Resultado esperado:
🤖 Imagen Generada con IA
Confianza: ~80-95%
Autenticidad: ~20-40/100
```

**Caso 2: Foto Real**
```
1. NO escribas ningún link
2. Haz clic en "Subir imagen"
3. Selecciona una foto tomada con tu celular
4. Clic en "Verificar contenido"

Resultado esperado:
📸 Imagen Real/Auténtica
Confianza: ~85-95%
Autenticidad: ~75-95/100
```

---

### 4️⃣ Probar Link + Imagen (Verificación Completa)

```
1. Escribe: https://nmas.com.mx/deportes
2. Sube una imagen cualquiera
3. Clic en "Verificar contenido"

Verás:
✅ Análisis del artículo (credibilidad de N+)
✅ Análisis de la imagen (IA o real)
✅ Artículos relacionados
✅ Fact-checks (si hay)
```

---

### 5️⃣ Ver la Consola del Navegador

Presiona `F12` para abrir DevTools y ve a la pestaña "Console"

Verás logs como:
```
Analizando imagen con IA...
Groq Vision API response: {...}
```

Si hay errores, también aparecerán ahí.

---

## 🎯 Señales a Buscar en los Resultados

### Imagen Generada con IA ✅ (Funcionando correctamente)

```
🤖 Imagen Generada con IA
Confianza: 85%
Autenticidad: 35/100

🚨 Señales de IA Detectadas:
- Manos con dedos deformados
- Texto ilegible o distorsionado
- Patrones repetitivos
- Transiciones poco naturales

⚠️ Signos de Manipulación:
- Iluminación inconsistente
- Sombras que no coinciden
```

### Imagen Real ✅ (Funcionando correctamente)

```
📸 Imagen Real/Auténtica
Confianza: 92%
Autenticidad: 88/100

🔍 Contexto: Una persona en un parque con iluminación natural
📊 Calidad: Alta
💡 Recomendación: La imagen parece auténtica
```

---

## 🐛 Solución de Problemas

### Error: "Error al analizar imagen con Groq Vision"

**Causa**: API key inválida o límite excedido

**Solución**:
```powershell
# Verificar que .env tenga la key correcta
cat .env | Select-String "GROQ"

# Debería mostrar:
VITE_GROQ_API_KEY=tu_api_key_de_groq_aqui
```

Si no aparece o es diferente, edita `.env` y agrega/corrige la línea.

### Error: "Cannot read properties of undefined"

**Causa**: La respuesta de la API no tiene el formato esperado

**Solución**: Esto es normal en algunos casos, el sistema lo maneja mostrando un resultado parcial.

### La imagen no se analiza

**Causa**: Posiblemente el archivo es muy grande

**Solución**:
- Usa imágenes menores a 5MB
- Comprime la imagen antes de subirla
- Formatos recomendados: JPG, PNG

---

## 📊 Ejemplos de Prueba Completos

### Test 1: Persona IA
```
Sitio: https://thispersondoesnotexist.com
Acción: Descargar imagen → Subir sin link

Resultado esperado:
- isAIGenerated: true
- confidence: >80%
- aiSignals: ["patrones artificiales", "...]
```

### Test 2: Noticia + Foto Real
```
Link: https://www.jornada.com.mx/ultimas
Imagen: Foto de tu celular

Resultado esperado:
- Artículo: ~85/100 (La Jornada es fuente confiable)
- Imagen: Real (>80%)
```

### Test 3: Noticia + Imagen IA
```
Link: https://nmas.com.mx
Imagen: De thispersondoesnotexist.com

Resultado esperado:
- Artículo: ~85/100 (N+ es confiable)
- Imagen: Generada con IA
- ⚠️ Toast: "Imagen detectada como generada por IA"
```

---

## ✅ Checklist de Funcionalidad

- [ ] Subir imagen sin link → Analiza solo imagen
- [ ] Subir link sin imagen → Analiza solo artículo
- [ ] Subir link + imagen → Analiza ambos
- [ ] Detecta imagen IA → Muestra tarjeta roja 🤖
- [ ] Detecta imagen real → Muestra tarjeta verde 📸
- [ ] Muestra señales de IA detectadas
- [ ] Muestra signos de manipulación
- [ ] Muestra calidad de imagen
- [ ] Muestra contexto de la imagen
- [ ] Toast notifica resultado
- [ ] Sin errores en consola

---

## 🎓 Tips para Probar

1. **Usa imágenes obvias primero**
   - Empieza con thispersondoesnotexist.com (claramente IA)
   - Luego prueba con fotos de tu celular (claramente reales)

2. **Gradualmente usa casos difíciles**
   - Imágenes IA muy bien hechas
   - Fotos reales con mucho Photoshop

3. **Verifica la consola**
   - Siempre revisa si hay errores
   - Mira la respuesta de la API

4. **Prueba límites**
   - Imágenes muy grandes
   - Formatos raros (WebP, GIF animado)
   - Múltiples análisis seguidos

---

¡Listo para probar! 🚀

Si encuentras algún problema, revisa:
1. Console del navegador (F12)
2. Terminal donde corre `npm run dev`
3. Archivo `.env` con las API keys
