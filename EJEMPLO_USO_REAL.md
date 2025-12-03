# 🎯 Ejemplo de Uso Real - Verificación de Noticias

## Caso de Uso Real: Verificar una noticia sobre salud

### 📝 Escenario
Un usuario recibe un mensaje de WhatsApp con un link a una noticia que dice:
> "Estudio científico comprueba que la vitamina C cura el COVID-19"

### 🔍 Paso a Paso

---

## 1️⃣ Usuario ingresa el link

```
URL ingresada:
https://ejemplo-noticioso.com/vitamina-c-cura-covid
```

---

## 2️⃣ Sistema extrae información clave

```javascript
// El sistema identifica:
{
  domain: "ejemplo-noticioso.com",
  searchTerms: "vitamina C cura COVID-19",
  title: "Estudio científico comprueba vitamina C"
}
```

---

## 3️⃣ Consulta a Google Fact Check API

```javascript
// Búsqueda automática
const query = "vitamina C cura COVID-19";
const factChecks = await checkGoogleFactCheck(query);
```

### Resultados encontrados:

```json
{
  "claims": [
    {
      "text": "La vitamina C cura el coronavirus",
      "claimant": "Publicación de Facebook",
      "claimDate": "2020-03-15",
      "claimReview": [
        {
          "publisher": {
            "name": "Reuters Fact Check",
            "site": "reuters.com"
          },
          "url": "https://reuters.com/fact-check/vitamin-c-covid",
          "title": "No hay evidencia de que vitamina C cure COVID-19",
          "reviewDate": "2020-03-18",
          "textualRating": "FALSE",
          "languageCode": "en"
        }
      ]
    },
    {
      "text": "Vitamina C previene coronavirus",
      "claimant": "Cadena de WhatsApp",
      "claimReview": [
        {
          "publisher": {
            "name": "AFP Fact Check",
            "site": "factcheck.afp.com"
          },
          "url": "https://factcheck.afp.com/vitamin-c-covid",
          "title": "No existe cura comprobada para COVID-19",
          "textualRating": "FALSE",
          "reviewDate": "2020-04-10"
        }
      ]
    },
    {
      "text": "Estudios muestran beneficios de vitamina C",
      "claimReview": [
        {
          "publisher": {
            "name": "Snopes",
            "site": "snopes.com"
          },
          "url": "https://snopes.com/fact-check/vitamin-c-coronavirus",
          "title": "¿La vitamina C cura el COVID?",
          "textualRating": "MIXTURE",
          "reviewDate": "2020-05-20"
        }
      ]
    }
  ]
}
```

---

## 4️⃣ Análisis del Sistema

### Fact-checks encontrados:
- **3 verificaciones** de fuentes confiables
- **2 dicen "FALSE"** (Falso)
- **1 dice "MIXTURE"** (Mixto - puede ayudar al sistema inmune pero NO cura)

### Análisis de la fuente:
```javascript
{
  domain: "ejemplo-noticioso.com",
  isKnown: false, // No está en la lista de medios verificados
  hasHistory: false, // Dominio nuevo o poco conocido
  riskLevel: "high" // Sin credenciales establecidas
}
```

### Cálculo de credibilidad:
```javascript
let score = 50; // Base

// Fuente desconocida
score -= 20; // = 30

// Múltiples fact-checkers dicen FALSE
score -= 25; // = 5

// Solo un verificador dice "MIXTURE" (no totalmente falso)
score += 10; // = 15

// Final: 15/100 → BAJA CREDIBILIDAD
```

---

## 5️⃣ Resultado Mostrado al Usuario

```
┌──────────────────────────────────────────────────────┐
│  🔍 RESULTADOS DE VERIFICACIÓN                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ⚠️ BAJA CREDIBILIDAD                                │
│  Credibilidad: ██░░░░░░░░ 15/100                   │
│                                                      │
│  ❌ Esta información ha sido verificada y           │
│     desmentida por múltiples fact-checkers          │
│                                                      │
├──────────────────────────────────────────────────────┤
│  📊 VERIFICACIONES ENCONTRADAS (3)                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1. ❌ Reuters Fact Check                           │
│     Veredicto: FALSO                                │
│     "No hay evidencia de que vitamina C cure        │
│     COVID-19"                                       │
│     🔗 Ver verificación completa                    │
│                                                      │
│  2. ❌ AFP Fact Check                               │
│     Veredicto: FALSO                                │
│     "No existe cura comprobada para COVID-19"       │
│     🔗 Ver verificación completa                    │
│                                                      │
│  3. ⚠️ Snopes                                        │
│     Veredicto: MIXTO                                │
│     "La vitamina C puede ayudar al sistema          │
│     inmune pero NO cura el COVID-19"                │
│     🔗 Ver verificación completa                    │
│                                                      │
├──────────────────────────────────────────────────────┤
│  🎯 RECOMENDACIÓN                                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ⛔ NO COMPARTAS esta información                   │
│                                                      │
│  ✅ QUÉ HACER:                                       │
│  • Consulta fuentes oficiales (OMS, CDC)           │
│  • Verifica con múltiples medios confiables        │
│  • Desconfía de "curas milagrosas"                 │
│                                                      │
│  📰 Fuentes Confiables:                             │
│  • Reuters: reuters.com                             │
│  • AFP Fact Check: factcheck.afp.com                │
│  • Snopes: snopes.com                               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 6️⃣ Interpretación para el Usuario

### ¿Qué significa esto?

**Tu sistema encontró:**
- ✅ **3 verificadores independientes** analizaron esta afirmación
- ❌ **2 de 3 dicen que es FALSO**
- ⚠️ **1 de 3 dice que es MIXTO** (parcialmente verdadero)

**Conclusión:**
La afirmación de que "vitamina C **CURA** COVID-19" es **FALSA**. Aunque la vitamina C puede ayudar al sistema inmune en general, **NO CURA** el coronavirus.

---

## 🎓 Otros Ejemplos

### Ejemplo 2: Noticia Verdadera

**Input:**
```
URL: https://bbc.com/news/vacuna-aprobada-fda
Título: "FDA aprueba vacuna de Pfizer contra COVID-19"
```

**Output:**
```
✅ ALTA CREDIBILIDAD - 95/100

Verificaciones encontradas:
• Reuters: TRUE ✅
• AP News: TRUE ✅
• AFP: TRUE ✅

Fuente: BBC News (credibilidad alta)
Recomendación: Información confiable de fuente verificada
```

---

### Ejemplo 3: Sin Verificaciones Previas

**Input:**
```
URL: https://blog-personal.com/opinion-local
Título: "Opinión sobre situación política local"
```

**Output:**
```
⚠️ CREDIBILIDAD MEDIA - 50/100

No se encontraron fact-checks previos
Fuente: Blog personal (no verificado)

Recomendación:
• Busca la misma información en medios establecidos
• Verifica las fuentes citadas en el artículo
• Cruza información con al menos 2 fuentes más
```

---

## 💡 Consejos para Usuarios

### Señales de BAJA credibilidad:
🚩 Fuente desconocida o nueva
🚩 Múltiples fact-checkers dicen "FALSE"
🚩 Afirmaciones extraordinarias sin pruebas
🚩 Urgencia para compartir ("¡Comparte antes de que lo borren!")
🚩 Muchos errores ortográficos o gramaticales

### Señales de ALTA credibilidad:
✅ Fuente reconocida (BBC, Reuters, AP, etc.)
✅ Cita fuentes verificables
✅ Otros medios confiables reportan lo mismo
✅ Fact-checkers confirman la información
✅ Presenta datos y contexto

---

## 🔧 Configuración Necesaria

Para que este ejemplo funcione en tu proyecto:

1. **Obtén tu API key de Google Fact Check** (gratuita)
2. **Agrégala al archivo `.env`:**
   ```
   VITE_GOOGLE_FACTCHECK_API_KEY=tu_api_key_aqui
   ```
3. **Reinicia tu servidor de desarrollo**
4. **¡Listo para usar!**

---

## 📞 ¿Cómo usar en tu proyecto?

```javascript
// En cualquier componente
import { verifyNews } from '@/services/newsVerification';

// Verificar una URL
const resultado = await verifyNews('https://ejemplo.com/noticia');

// Ver los resultados
console.log(resultado.credibilityScore); // 0-100
console.log(resultado.recommendation); // Recomendación
console.log(resultado.checks.factChecks); // Array de verificaciones
```

---

**¡Tu aplicación ahora puede verificar noticias como los profesionales! 🎉**
