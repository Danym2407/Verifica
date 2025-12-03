import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Globe, Cpu, Video, RefreshCw, ShieldCheck, FileText, Brain, AlertCircle, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Gauge from '@/components/Gauge';
import FactCheckCard from '@/components/FactCheckCard';
import ContentDisplay from '@/components/ContentDisplay';
import RelatedArticles from '@/components/RelatedArticles';

const VerificationResults = ({ onReset, hasLink, hasImage, hasVideo, verificationData, imagePreview }) => {
  // Determine scores and status based on verification data or input type
  let score = 0;
  if (verificationData && verificationData.credibilityScore !== undefined) {
    score = verificationData.credibilityScore;
  } else if (hasLink) {
    score = 95;
  } else if (hasImage) {
    score = 92; // High authenticity for image demo
  } else if (hasVideo) {
    score = 65; // Medium authenticity for video demo
  } else {
    score = 25; // Fallback for manipulated
  }

  // Helper to determine status details based on score
  const getStatusDetails = (score) => {
    if (score >= 75) {
      return {
        status: 'Verificado',
        description: 'Contenido con alta probabilidad de autenticidad',
        icon: CheckCircle2,
        colorClasses: {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          progress: 'bg-green-500',
          icon: 'text-green-700'
        }
      };
    }
    if (score >= 40) {
      return {
        status: 'Dudoso',
        description: 'Contenido con indicadores mixtos, requiere revisión',
        icon: AlertTriangle,
        colorClasses: {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
          progress: 'bg-yellow-500',
          icon: 'text-yellow-700'
        }
      };
    }
    return {
      status: 'Posiblemente manipulado',
      description: 'Se han detectado patrones de manipulación digital',
      icon: XCircle,
      colorClasses: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        progress: 'bg-red-500',
        icon: 'text-red-700'
      }
    };
  };

  const statusDetails = getStatusDetails(score);
  const StatusIcon = statusDetails.icon;
  const colors = statusDetails.colorClasses;

  // Generate results data based on verification data
  const generateResults = () => {
    const resultsArray = [];

    if (hasLink && verificationData && verificationData.checks) {
      const checks = verificationData.checks;
      
      // Fuentes encontradas
      if (checks.sourceVerification) {
        const totalArticles = checks.sourceVerification.totalArticles || 0;
        const recentArticles = checks.sourceVerification.recentArticles?.length || 0;
        resultsArray.push({
          id: 1,
          icon: Globe,
          title: 'Fuentes encontradas',
          value: `${recentArticles} artículos`,
          description: `${totalArticles} artículos totales del dominio`,
          classes: {
            bg: 'bg-blue-50',
            text: 'text-blue-600'
          },
          show: true
        });
      }

      // Verificación de credibilidad
      if (checks.urlAnalysis) {
        const rating = checks.urlAnalysis.sourceRating?.rating || 'unknown';
        const ratingText = {
          'high': 'Alta credibilidad',
          'medium': 'Credibilidad moderada',
          'low': 'Baja credibilidad',
          'satire': 'Sitio satírico',
          'unknown': 'Fuente desconocida'
        }[rating];
        
        resultsArray.push({
          id: 2,
          icon: ShieldCheck,
          title: 'Análisis de fuente',
          value: ratingText,
          description: `Dominio: ${checks.urlAnalysis.domain}`,
          classes: {
            bg: 'bg-purple-50',
            text: 'text-purple-600'
          },
          show: true
        });
      }

      // Fact checks encontrados
      if (checks.factChecks && checks.factChecks.length > 0) {
        resultsArray.push({
          id: 3,
          icon: CheckCircle2,
          title: 'Fact Checks',
          value: `${checks.factChecks.length} verificaciones`,
          description: 'Encontradas en Google Fact Check',
          classes: {
            bg: 'bg-green-50',
            text: 'text-green-600'
          },
          show: true
        });
      }
    } else {
      // Fallback para imágenes y videos (simulación)
      resultsArray.push(
        {
          id: 2,
          icon: Cpu,
          title: 'Integridad digital',
          value: hasImage ? '98%' : 'N/A',
          description: hasImage ? 'Estructura de píxeles consistente' : 'No aplicable',
          classes: {
            bg: 'bg-purple-50',
            text: 'text-purple-600'
          },
          show: hasImage
        },
        {
          id: 3,
          icon: Video,
          title: 'Análisis de frames',
          value: hasVideo ? '65%' : 'N/A',
          description: hasVideo ? 'Inconsistencias leves detectadas' : 'No aplicable',
          classes: {
            bg: 'bg-pink-50',
            text: 'text-pink-600'
          },
          show: hasVideo
        }
      );
    }

    return resultsArray.filter(r => r.show);
  };

  const results = generateResults();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-8 space-y-6"
    >
      {/* Overall Status Card with Gauge */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Status Text */}
          <div className={`p-8 flex flex-col justify-center ${colors.bg}`}>
            <div className="flex items-center gap-3 mb-4">
              <StatusIcon className={`w-8 h-8 ${colors.icon}`} />
              <span className={`font-bold text-lg uppercase tracking-wide ${colors.text}`}>
                Resultado del análisis
              </span>
            </div>
            <h3 className={`text-4xl font-bold mb-3 ${colors.text}`}>
              {statusDetails.status}
            </h3>
            <p className={`${colors.text} opacity-90 text-lg`}>
              {statusDetails.description}
            </p>
            
            <div className="mt-8">
              <div className="text-sm font-medium text-gray-500 mb-2">Nivel de confianza</div>
              <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${colors.progress}`}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Right: Gauge Visualization */}
          <div className="p-8 flex items-center justify-center bg-white border-t md:border-t-0 md:border-l border-gray-100">
            <div className="relative">
               <Gauge value={score} size={220} label="Autenticidad" />
            </div>
          </div>
        </div>
        
        {/* Multimedia Content Badge */}
        {verificationData && verificationData.checks && verificationData.checks.multimediaInfo && 
         verificationData.checks.multimediaInfo.isMultimedia && (
          <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-300 rounded-lg">
            <Video className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">
              Contenido Multimedia Detectado - El análisis se ajustó para considerar formato de video/audio
            </span>
          </div>
        )}
      </motion.div>

      {/* Detailed Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.filter(result => result.show).map((result, index) => {
          const Icon = result.icon;
          return (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 md:col-span-3"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className={`p-4 rounded-2xl ${result.classes.bg}`}>
                  <Icon className={`w-8 h-8 ${result.classes.text}`} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">
                    {result.title}
                  </h4>
                  <p className="text-gray-500">
                    {result.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-3xl font-bold ${result.classes.text}`}>
                    {result.value}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Article Content & AI Analysis Section */}
      {verificationData && verificationData.checks && verificationData.checks.articleContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-purple-100"
        >
          <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4 text-lg">
            <FileText className="w-6 h-6 text-purple-600" />
            Contenido Extraído
          </h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-bold text-xl text-gray-900 mb-2 leading-tight">
                {verificationData.checks.articleContent.title}
              </h5>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                <p className="flex items-center gap-1">
                  <span className="font-semibold">✍️ Autor:</span> 
                  {verificationData.checks.articleContent.author || 'No disponible'}
                </p>
                {verificationData.checks.articleContent.publishedDate && (
                  <p className="flex items-center gap-1">
                    <span className="font-semibold">📅 Fecha:</span> 
                    {new Date(verificationData.checks.articleContent.publishedDate).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
            
            {verificationData.checks.articleContent.content && (
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  📝 Contenido del Artículo
                </h6>
                <ContentDisplay 
                  content={verificationData.checks.articleContent.content} 
                  maxInitialLength={500}
                />
              </div>
            )}
            
            {verificationData.checks.articleContent.description && 
             verificationData.checks.articleContent.description !== verificationData.checks.articleContent.excerpt && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h6 className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2">
                  💡 Descripción
                </h6>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {verificationData.checks.articleContent.description}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Image Analysis Section */}
      {verificationData && verificationData.checks && verificationData.checks.imageAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 shadow-lg border ${
            verificationData.checks.imageAnalysis.isAIGenerated 
              ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' 
              : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
          }`}
        >
          <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4 text-lg">
            <ImageIcon className={`w-6 h-6 ${verificationData.checks.imageAnalysis.isAIGenerated ? 'text-red-600' : 'text-green-600'}`} />
            Análisis de Imagen con IA {verificationData.checks.imageAnalysis.source && `(${verificationData.checks.imageAnalysis.source})`}
          </h4>
          
          {/* Layout: Imagen a la izquierda, Resultados a la derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Preview de la imagen analizada */}
            {imagePreview && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-3">🖼️ Imagen Analizada</h5>
                <div className="flex justify-center items-center">
                  <img 
                    src={imagePreview} 
                    alt="Imagen analizada" 
                    className="max-w-full max-h-80 rounded-lg shadow-md object-contain border-2 border-gray-300"
                  />
                </div>
              </div>
            )}
            
            {/* Comparativa de IAs */}
            {verificationData.checks.imageAnalysis.individualResults && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-3">🔄 Comparativa de Motores de IA</h5>
                
                <div className="space-y-3">
                {/* OpenAI */}
                {verificationData.checks.imageAnalysis.individualResults.openai && (
                  <div className={`p-3 rounded-lg border-2 ${
                    verificationData.checks.imageAnalysis.agreement === 'full' 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🤖</span>
                      <span className="font-semibold text-sm">OpenAI GPT-4o</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="font-medium">Resultado:</span>{' '}
                        {verificationData.checks.imageAnalysis.individualResults.openai.isAIGenerated ? '🤖 IA' : '📸 Real'}
                      </div>
                      <div>
                        <span className="font-medium">Confianza:</span>{' '}
                        {verificationData.checks.imageAnalysis.individualResults.openai.confidence}%
                      </div>
                      <div>
                        <span className="font-medium">Autenticidad:</span>{' '}
                        {verificationData.checks.imageAnalysis.individualResults.openai.authenticityScore}/100
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Gemini */}
                {verificationData.checks.imageAnalysis.individualResults.gemini && (
                  <div className={`p-3 rounded-lg border-2 ${
                    verificationData.checks.imageAnalysis.agreement === 'full' 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🔷</span>
                      <span className="font-semibold text-sm">Gemini</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="font-medium">Resultado:</span>{' '}
                        {verificationData.checks.imageAnalysis.individualResults.gemini.isAIGenerated ? '🤖 IA' : '📸 Real'}
                      </div>
                      <div>
                        <span className="font-medium">Confianza:</span>{' '}
                        {verificationData.checks.imageAnalysis.individualResults.gemini.confidence}%
                      </div>
                      <div>
                        <span className="font-medium">Autenticidad:</span>{' '}
                        {verificationData.checks.imageAnalysis.individualResults.gemini.authenticityScore}/100
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Groq */}
                {verificationData.checks.imageAnalysis.individualResults.groq && (
                  <div className={`p-3 rounded-lg border-2 ${
                    verificationData.checks.imageAnalysis.agreement === 'full' 
                      ? 'bg-purple-50 border-purple-300' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">⚡</span>
                      <span className="font-semibold text-sm">Groq</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="font-medium">Resultado:</span>{' '}
                        {verificationData.checks.imageAnalysis.individualResults.groq.isAIGenerated ? '🤖 IA' : '📸 Real'}
                      </div>
                      <div>
                        <span className="font-medium">Confianza:</span>{' '}
                        {verificationData.checks.imageAnalysis.individualResults.groq.confidence}%
                      </div>
                      <div>
                        <span className="font-medium">Autenticidad:</span>{' '}
                        {verificationData.checks.imageAnalysis.individualResults.groq.authenticityScore}/100
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Estado de acuerdo */}
              <div className={`mt-3 p-2 rounded-lg text-center text-sm font-medium ${
                verificationData.checks.imageAnalysis.agreement === 'full'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {verificationData.checks.imageAnalysis.agreement === 'full' 
                  ? `✓ Todas las IAs están de acuerdo` 
                  : '⚠ Resultados mixtos - Priorizado el de mayor confianza'}
              </div>
            </div>
          )}
          </div>
          
          <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4 text-lg">
            <ImageIcon className={`w-6 h-6 ${verificationData.checks.imageAnalysis.isAIGenerated ? 'text-red-600' : 'text-green-600'}`} />
            Resultado Final
          </h4>
          
          <div className="space-y-4">
            {/* Detection Result */}
            <div className={`rounded-lg p-4 border ${
              verificationData.checks.imageAnalysis.isAIGenerated 
                ? 'bg-red-100 border-red-300' 
                : 'bg-green-100 border-green-300'
            }`}>
              <h5 className={`font-bold mb-2 text-lg ${
                verificationData.checks.imageAnalysis.isAIGenerated ? 'text-red-900' : 'text-green-900'
              }`}>
                {verificationData.checks.imageAnalysis.isAIGenerated ? '🤖 Imagen Generada con IA' : '📸 Imagen Real/Auténtica'}
              </h5>
              <p className={`text-sm ${
                verificationData.checks.imageAnalysis.isAIGenerated ? 'text-red-800' : 'text-green-800'
              }`}>
                Confianza: {verificationData.checks.imageAnalysis.confidence}% | 
                Autenticidad: {verificationData.checks.imageAnalysis.authenticityScore}/100
              </p>
            </div>

            {/* Context */}
            {verificationData.checks.imageAnalysis.context && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2">🔍 Contexto de la Imagen</h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {verificationData.checks.imageAnalysis.context}
                </p>
              </div>
            )}

            {/* AI Signals */}
            {verificationData.checks.imageAnalysis.aiSignals && verificationData.checks.imageAnalysis.aiSignals.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h5 className="font-semibold text-orange-900 mb-2">🚨 Señales de IA Detectadas</h5>
                <ul className="space-y-1">
                  {verificationData.checks.imageAnalysis.aiSignals.map((signal, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-orange-800">
                      <span className="text-orange-500 mt-0.5">▸</span>
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Manipulation Signs */}
            {verificationData.checks.imageAnalysis.manipulationSigns && verificationData.checks.imageAnalysis.manipulationSigns.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h5 className="font-semibold text-red-900 mb-2">⚠️ Signos de Manipulación</h5>
                <ul className="space-y-1">
                  {verificationData.checks.imageAnalysis.manipulationSigns.map((sign, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                      <span className="text-red-500 mt-0.5">⚠</span>
                      {sign}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Image Quality */}
            {verificationData.checks.imageAnalysis.imageQuality && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2">📊 Calidad de Imagen</h5>
                <p className="text-sm text-blue-800">
                  {verificationData.checks.imageAnalysis.imageQuality.charAt(0).toUpperCase() + 
                   verificationData.checks.imageAnalysis.imageQuality.slice(1)}
                </p>
              </div>
            )}

            {/* Recommendation */}
            {verificationData.checks.imageAnalysis.recommendation && (
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 border border-purple-200">
                <h5 className="font-semibold text-gray-900 mb-2">💡 Recomendación</h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {verificationData.checks.imageAnalysis.recommendation}
                </p>
              </div>
            )}

            {/* Related Articles Found - NUEVA SECCIÓN */}
            {verificationData.checks.imageAnalysis.relatedArticles && verificationData.checks.imageAnalysis.relatedArticles.length > 0 && (
              <div className="bg-white rounded-lg p-6 border-2 border-blue-300 shadow-md">
                <h5 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                  <Globe className="w-6 h-6 text-blue-600" />
                  📰 Noticias Encontradas en Internet
                </h5>
                <p className="text-sm text-gray-600 mb-4">
                  Búsqueda realizada: <span className="font-semibold text-blue-600">"{verificationData.checks.imageAnalysis.searchQuery}"</span>
                </p>
                
                <div className="space-y-4">
                  {verificationData.checks.imageAnalysis.relatedArticles.map((article, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h6 className="font-bold text-gray-900 mb-2 text-base leading-tight">
                            {article.title || 'Sin título'}
                          </h6>
                          {article.description && (
                            <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                              {article.description}
                            </p>
                          )}
                          {article.content && article.content !== article.description && (
                            <p className="text-xs text-gray-600 mb-2 italic line-clamp-2">
                              {article.content}
                            </p>
                          )}
                          <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mt-2"
                          >
                            🔗 Ver artículo completo
                            <span className="text-xs">↗</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verification Summary */}
                {verificationData.checks.imageAnalysis.webVerification && (
                  <div className={`mt-4 p-4 rounded-lg border-2 ${
                    verificationData.checks.imageAnalysis.webVerification.foundRealEvent
                      ? 'bg-green-50 border-green-300'
                      : 'bg-orange-50 border-orange-300'
                  }`}>
                    <h6 className={`font-bold mb-2 ${
                      verificationData.checks.imageAnalysis.webVerification.foundRealEvent
                        ? 'text-green-900'
                        : 'text-orange-900'
                    }`}>
                      {verificationData.checks.imageAnalysis.webVerification.foundRealEvent 
                        ? '✅ Evento Verificado' 
                        : '⚠️ Sin Verificación Conclusiva'}
                    </h6>
                    <p className={`text-sm mb-2 ${
                      verificationData.checks.imageAnalysis.webVerification.foundRealEvent
                        ? 'text-green-800'
                        : 'text-orange-800'
                    }`}>
                      {verificationData.checks.imageAnalysis.webVerification.eventSummary}
                    </p>
                    {verificationData.checks.imageAnalysis.webVerification.reasoning && (
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Razonamiento:</strong> {verificationData.checks.imageAnalysis.webVerification.reasoning}
                      </p>
                    )}
                    {verificationData.checks.imageAnalysis.webVerification.location && (
                      <p className="text-xs text-gray-600 mt-1">
                        📍 <strong>Ubicación:</strong> {verificationData.checks.imageAnalysis.webVerification.location}
                      </p>
                    )}
                    {verificationData.checks.imageAnalysis.webVerification.date && (
                      <p className="text-xs text-gray-600 mt-1">
                        📅 <strong>Fecha:</strong> {verificationData.checks.imageAnalysis.webVerification.date}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Video Analysis Section */}
      {verificationData && verificationData.checks && verificationData.checks.videoAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 shadow-lg border ${
            verificationData.checks.videoAnalysis.isAIGenerated 
              ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' 
              : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
          }`}
        >
          <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4 text-lg">
            <Video className={`w-6 h-6 ${verificationData.checks.videoAnalysis.isAIGenerated ? 'text-red-600' : 'text-green-600'}`} />
            Análisis de Video con IA
          </h4>
          
          <div className="space-y-4">
            {/* Veredicto General */}
            <div className={`rounded-lg p-4 border ${
              verificationData.checks.videoAnalysis.isAIGenerated 
                ? 'bg-red-100 border-red-300' 
                : 'bg-green-100 border-green-300'
            }`}>
              <h5 className={`font-bold mb-2 text-lg ${
                verificationData.checks.videoAnalysis.isAIGenerated ? 'text-red-900' : 'text-green-900'
              }`}>
                {verificationData.checks.videoAnalysis.verdict}
              </h5>
              <p className="text-sm font-medium">
                Frames analizados: {verificationData.checks.videoAnalysis.framesAnalyzed}
                {' | '}
                IA: {verificationData.checks.videoAnalysis.aiFrames}
                {' | '}
                Real: {verificationData.checks.videoAnalysis.realFrames}
              </p>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2">📊 Score de Autenticidad</h5>
                <div className="text-3xl font-bold" style={{
                  color: verificationData.checks.videoAnalysis.authenticityScore > 65 ? '#10b981' : 
                         verificationData.checks.videoAnalysis.authenticityScore > 40 ? '#f59e0b' : '#ef4444'
                }}>
                  {verificationData.checks.videoAnalysis.authenticityScore}/100
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {verificationData.checks.videoAnalysis.authenticityScore > 65 ? 'Alta autenticidad' : 
                   verificationData.checks.videoAnalysis.authenticityScore > 40 ? 'Autenticidad dudosa' : 'Baja autenticidad'}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2">🎯 Confianza</h5>
                <div className="text-3xl font-bold text-blue-600">
                  {verificationData.checks.videoAnalysis.confidence}%
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Nivel de certeza del análisis
                </p>
              </div>
            </div>

            {/* Descripción */}
            {verificationData.checks.videoAnalysis.description && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2">🎬 Análisis de Frames</h5>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {verificationData.checks.videoAnalysis.description}
                </p>
              </div>
            )}

            {/* Evidencias */}
            {verificationData.checks.videoAnalysis.evidence && verificationData.checks.videoAnalysis.evidence.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2">🔍 Evidencias Detectadas</h5>
                <ul className="space-y-1">
                  {verificationData.checks.videoAnalysis.evidence.slice(0, 10).map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {verificationData.checks.videoAnalysis.evidence.length > 10 && (
                    <li className="text-sm text-gray-500 italic">
                      ... y {verificationData.checks.videoAnalysis.evidence.length - 10} evidencias más
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Detalles por Frame */}
            {verificationData.checks.videoAnalysis.frameDetails && verificationData.checks.videoAnalysis.frameDetails.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-3">📹 Análisis Individual por Frame</h5>
                <div className="space-y-2">
                  {verificationData.checks.videoAnalysis.frameDetails.map((frame, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${
                      frame.isAIGenerated ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">
                          Frame {frame.frameNumber} ({frame.time}s)
                        </span>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          frame.isAIGenerated ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                        }`}>
                          {frame.isAIGenerated ? '🤖 IA' : '📸 Real'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Autenticidad: {frame.authenticityScore}/100 | Confianza: {frame.confidence}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* AI Analysis Section */}
      {verificationData && verificationData.checks && verificationData.checks.aiAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg border border-blue-100"
        >
          <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4 text-lg">
            <Brain className="w-6 h-6 text-blue-600" />
            Análisis con Inteligencia Artificial
          </h4>
          
          <div className="space-y-4">
            {/* Summary */}
            {verificationData.checks.aiAnalysis.summary && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2">📝 Resumen</h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {verificationData.checks.aiAnalysis.summary}
                </p>
              </div>
            )}

            {/* Main Claims */}
            {verificationData.checks.aiAnalysis.mainClaims && verificationData.checks.aiAnalysis.mainClaims.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2">🎯 Afirmaciones Principales</h5>
                <ul className="space-y-2">
                  {verificationData.checks.aiAnalysis.mainClaims.map((claim, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-500 mt-0.5">•</span>
                      {claim}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Red Flags */}
            {verificationData.checks.aiAnalysis.redFlags && verificationData.checks.aiAnalysis.redFlags.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h5 className="flex items-center gap-2 font-semibold text-red-900 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  ⚠️ Señales de Alerta
                </h5>
                <ul className="space-y-2">
                  {verificationData.checks.aiAnalysis.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                      <span className="text-red-500 mt-0.5">⚠</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Recommendation */}
            {verificationData.checks.aiAnalysis.recommendation && (
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 border border-purple-200">
                <h5 className="font-semibold text-gray-900 mb-2">💡 Recomendación de la IA</h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {verificationData.checks.aiAnalysis.recommendation}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Related Articles Section */}
      {verificationData && verificationData.checks && verificationData.checks.sourceVerification && 
       verificationData.checks.sourceVerification.recentArticles && 
       verificationData.checks.sourceVerification.recentArticles.length > 0 && (
        <RelatedArticles 
          articles={verificationData.checks.sourceVerification.recentArticles}
          domain={verificationData.checks.sourceVerification.domain}
        />
      )}

      {/* Fact Checks Section */}
      {verificationData && verificationData.checks && verificationData.checks.factChecks && verificationData.checks.factChecks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4 text-lg">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
            Verificaciones de hechos encontradas ({verificationData.checks.factChecks.length})
          </h4>
          <div className="space-y-3">
            {verificationData.checks.factChecks.map((factCheck, index) => (
              <FactCheckCard key={index} factCheck={factCheck} index={index} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Info & Actions */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <h4 className="flex items-center gap-2 font-semibold text-slate-900 mb-4">
          <ShieldCheck className="w-5 h-5 text-slate-600" />
          Detalles del proceso de verificación
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 mb-6">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
            <p>Extracción de contenido con Jina AI</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
            <p>Análisis de veracidad con IA (Groq)</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
            <p>Búsqueda en Google Fact Check API</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
            <p>Verificación de credibilidad de fuentes</p>
          </div>
        </div>

        <Button
          onClick={onReset}
          className="w-full sm:w-auto py-6 px-8 text-base font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Analizar otro contenido
        </Button>
      </div>
    </motion.div>
  );
};

export default VerificationResults;