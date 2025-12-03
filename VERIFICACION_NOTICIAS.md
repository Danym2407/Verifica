# 🔍 Sistema de Verificación de Noticias

## 📋 Descripción

Este proyecto incluye un sistema completo de verificación de autenticidad de noticias que utiliza múltiples APIs para validar información y detectar posibles noticias falsas.

## 🚀 Características

- ✅ Verificación de enlaces de noticias
- 🔎 Búsqueda de fact-checks en Google Fact Check API
- 📰 Análisis de credibilidad de fuentes usando NewsAPI
- 🌐 Búsqueda de información relacionada
- 📊 Puntuación de credibilidad (0-100)
- 🎨 Interfaz visual intuitiva con React y Tailwind CSS

## 🔑 APIs Utilizadas

### 1. Google Fact Check API (Recomendada)

**¿Qué hace?** Busca verificaciones de hechos (fact-checks) de organizaciones confiables.

**Cómo obtener la API key:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la "Fact Check Tools API"
4. Ve a "Credenciales" y crea una API key
5. Copia la API key y agrégala a tu archivo `.env`

**Límites:** 10,000 solicitudes gratis por día

**Documentación:** https://developers.google.com/fact-check/tools/api

### 2. NewsAPI

**¿Qué hace?** Busca artículos de noticias de fuentes verificadas y permite analizar la credibilidad de un dominio.

**Cómo obtener la API key:**
1. Regístrate en [NewsAPI.org](https://newsapi.org/register)
2. Verifica tu email
3. Copia tu API key desde el dashboard
4. Agrégala a tu archivo `.env`

**Límites gratuitos:**
- 100 solicitudes por día
- Solo artículos de los últimos 30 días

**Documentación:** https://newsapi.org/docs

### 3. SerpAPI (Opcional)

**¿Qué hace?** Permite hacer búsquedas en Google y otros motores para encontrar información relacionada.

**Cómo obtener la API key:**
1. Regístrate en [SerpAPI](https://serpapi.com/)
2. Verifica tu email
3. Copia tu API key desde el dashboard
4. Agrégala a tu archivo `.env`

**Límites gratuitos:** 100 búsquedas al mes

**Documentación:** https://serpapi.com/search-api

## ⚙️ Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
copy .env.example .env
```

Edita el archivo `.env` y agrega tus API keys:

```env
VITE_GOOGLE_FACTCHECK_API_KEY=tu_api_key_aqui
VITE_NEWS_API_KEY=tu_api_key_aqui
VITE_SERP_API_KEY=tu_api_key_aqui
```

### 3. Ejecutar el proyecto

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

## 📖 Cómo usar

1. **Verificar una noticia:**
   - Pega el enlace de la noticia en el campo de texto
   - Haz clic en "Verificar contenido"
   - Espera a que el sistema analice la información

2. **Interpretar los resultados:**
   - **Verde (75-100):** Alta credibilidad - Fuente confiable
   - **Amarillo (50-74):** Credibilidad moderada - Verificar con otras fuentes
   - **Rojo (0-49):** Baja credibilidad - Proceder con precaución

3. **Información mostrada:**
   - Puntuación de credibilidad general
   - Número de fuentes encontradas
   - Análisis de la credibilidad del dominio
   - Fact-checks relacionados encontrados

## 🔧 Funcionamiento Técnico

### Archivo: `src/services/newsVerification.js`

Este archivo contiene toda la lógica de verificación:

- **`verifyNews(url, title)`**: Función principal que coordina todas las verificaciones
- **`checkGoogleFactCheck(query)`**: Busca fact-checks en Google
- **`checkNewsSource(url)`**: Verifica la credibilidad de la fuente
- **`searchRelatedInformation(topic)`**: Busca información relacionada
- **`calculateCredibilityScore(checks)`**: Calcula el puntaje de credibilidad

### Flujo de verificación:

```
Usuario ingresa URL
    ↓
Extrae dominio y título
    ↓
Consulta Google Fact Check API
    ↓
Consulta NewsAPI para info de la fuente
    ↓
Busca información relacionada (SerpAPI)
    ↓
Calcula puntuación de credibilidad
    ↓
Muestra resultados al usuario
```

## 🎯 Casos de Uso

### Ejemplo 1: Verificar noticia de Reuters

```
URL: https://www.reuters.com/article/...
Resultado esperado: Alta credibilidad (90-100)
- Reuters es una fuente reconocida
- Miles de artículos en su historial
- Fact-checks positivos
```

### Ejemplo 2: Verificar sitio desconocido

```
URL: https://sitiodesconocido.com/noticia
Resultado esperado: Credibilidad moderada-baja (30-60)
- Fuente no reconocida
- Pocos artículos encontrados
- Sin fact-checks disponibles
```

### Ejemplo 3: Verificar sitio satírico

```
URL: https://theonion.com/article/...
Resultado esperado: Baja credibilidad (0-20)
- Detectado como sitio satírico
- No es fuente de noticias reales
```

## 🛡️ Modo Demostración

Si no configuras las API keys, el sistema funcionará en "modo demostración" con datos simulados. Para obtener resultados reales, es necesario configurar al menos:

- **Mínimo recomendado:** Google Fact Check API + NewsAPI
- **Completo:** Las tres APIs para máxima precisión

## 🔒 Seguridad

- ✅ Las API keys se almacenan en variables de entorno
- ✅ El archivo `.env` está en `.gitignore`
- ✅ Las llamadas a las APIs se hacen desde el frontend (considera mover a backend en producción)
- ⚠️ Para producción, considera implementar un backend para ocultar las API keys

## 📝 Mejoras Futuras

- [ ] Backend API para ocultar las keys
- [ ] Caché de resultados para evitar consultas repetidas
- [ ] Análisis de imágenes con detección de deepfakes
- [ ] Integración con más servicios de fact-checking
- [ ] Historial de verificaciones
- [ ] Exportar reportes en PDF

## 🤝 Contribuir

Si quieres agregar más funcionalidades:

1. Añade nuevas funciones en `src/services/newsVerification.js`
2. Actualiza el componente `VerificationResults.jsx` para mostrar nuevos datos
3. Documenta los cambios en este README

## 📄 Licencia

Este proyecto es de código abierto. Úsalo libremente para tus proyectos.

## 🆘 Soporte

Si tienes problemas:

1. Verifica que tus API keys estén correctamente configuradas
2. Revisa la consola del navegador para ver errores
3. Asegúrate de no haber excedido los límites de las APIs gratuitas
4. Lee la documentación oficial de cada API

---

**Nota:** Este sistema es una herramienta de apoyo para verificación de información. Siempre usa tu criterio y consulta múltiples fuentes antes de compartir información.
