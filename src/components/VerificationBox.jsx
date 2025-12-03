import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Image, Video, ArrowRight, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import VerificationResults from '@/components/VerificationResults';
import LoadingAnimation from '@/components/LoadingAnimation';
import { verifyNews, analyzeImageWithOpenAI, analyzeImageWithGemini, analyzeImageWithGroq, analyzeVideoWithAI } from '@/services/newsVerification';

const VerificationBox = () => {
  const [linkInput, setLinkInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const { toast } = useToast();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que solo sean formatos permitidos: JPG, JPEG, PNG
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      
      if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
        toast({
          title: "Formato no válido",
          description: "Solo se permiten imágenes en formato JPG, JPEG o PNG.",
          variant: "destructive"
        });
        e.target.value = ''; // Limpiar el input
        return;
      }
      
      // Validar tamaño máximo (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: "Archivo muy grande",
          description: "La imagen no debe superar los 10MB.",
          variant: "destructive"
        });
        e.target.value = '';
        return;
      }
      
      setSelectedImage(file);
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Imagen cargada",
        description: `${file.name} ha sido seleccionado correctamente.`,
      });
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Error",
          description: "Por favor, selecciona un archivo de video válido.",
          variant: "destructive"
        });
        return;
      }
      setSelectedVideo(file);
      toast({
        title: "Video cargado",
        description: `${file.name} ha sido seleccionado correctamente.`,
      });
    }
  };

  const handleVerify = async () => {
    if (!linkInput && !selectedImage && !selectedVideo) {
      toast({
        title: "Contenido requerido",
        description: "Por favor, ingresa un enlace o sube un archivo para verificar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setShowResults(false);

    try {
      // Si hay un link, verificar usando el servicio de noticias
      if (linkInput) {
        // Pasar la imagen si existe junto con el link
        const results = await verifyNews(linkInput, '', selectedImage);
        setVerificationData(results);
        
        // Mensaje personalizado según si hay imagen
        let message = `Credibilidad: ${results.credibilityScore}%. ${results.recommendation.message}`;
        if (selectedImage && results.checks?.imageAnalysis) {
          const imgAnalysis = results.checks.imageAnalysis;
          if (imgAnalysis.isAIGenerated) {
            message += ` ⚠️ Imagen detectada como generada por IA.`;
          } else {
            message += ` ✓ Imagen auténtica.`;
          }
        }
        
        toast({
          title: "Verificación completada",
          description: message,
        });
      } else if (selectedImage) {
        // Solo imagen sin link - analizar con TODAS las IAs disponibles
        toast({
          title: "Analizando imagen",
          description: "Analizando con OpenAI, Gemini y Groq para triple verificación...",
        });
        
        const analysisResults = {};
        
        // Análisis con OpenAI (prioritario)
        if (import.meta.env.VITE_OPENAI_API_KEY) {
          const openaiResult = await analyzeImageWithOpenAI(selectedImage);
          if (openaiResult) {
            analysisResults.openai = openaiResult;
          }
        }
        
        // Análisis con Gemini (segunda opinión)
        if (import.meta.env.VITE_GEMINI_API_KEY) {
          const geminiResult = await analyzeImageWithGemini(selectedImage);
          if (geminiResult) {
            analysisResults.gemini = geminiResult;
          }
        }
        
        // Análisis con Groq (tercera opinión)
        if (import.meta.env.VITE_GROQ_API_KEY) {
          const groqResult = await analyzeImageWithGroq(selectedImage);
          if (groqResult) {
            analysisResults.groq = groqResult;
          }
        }
        
        // Crear análisis combinado con las APIs disponibles
        let combinedAnalysis = null;
        const availableResults = Object.values(analysisResults).filter(r => r !== null);
        
        if (availableResults.length > 0) {
          // Calcular promedios
          const avgConfidence = Math.round(
            availableResults.reduce((sum, r) => sum + r.confidence, 0) / availableResults.length
          );
          const avgAuthenticity = Math.round(
            availableResults.reduce((sum, r) => sum + r.authenticityScore, 0) / availableResults.length
          );
          
          // Combinar todas las señales
          const allAISignals = [...new Set(availableResults.flatMap(r => r.aiSignals || []))];
          const allManipulationSigns = [...new Set(availableResults.flatMap(r => r.manipulationSigns || []))];
          const allEvidence = [...new Set(availableResults.flatMap(r => r.evidence || []))];
          
          // Determinar consenso
          const aiCount = availableResults.filter(r => r.isAIGenerated).length;
          const realCount = availableResults.filter(r => !r.isAIGenerated).length;
          
          let finalDecision, finalConfidence, finalAuthenticity, agreement;
          
          if (aiCount === availableResults.length) {
            // Todas coinciden: es IA
            finalDecision = true;
            finalConfidence = Math.max(...availableResults.map(r => r.confidence));
            finalAuthenticity = Math.min(...availableResults.map(r => r.authenticityScore));
            agreement = 'full';
          } else if (realCount === availableResults.length) {
            // Todas coinciden: es real
            finalDecision = false;
            finalConfidence = Math.max(...availableResults.map(r => r.confidence));
            finalAuthenticity = Math.max(...availableResults.map(r => r.authenticityScore));
            agreement = 'full';
          } else {
            // Hay desacuerdo - usar mayoría o el más confiable
            agreement = 'partial';
            finalDecision = aiCount > realCount;
            
            // Usar el resultado con mayor confianza
            const mostConfident = availableResults.reduce((max, r) => 
              r.confidence > max.confidence ? r : max
            );
            finalConfidence = mostConfident.confidence;
            finalAuthenticity = mostConfident.authenticityScore;
          }
          
          // Obtener descripción y evidencia del resultado más confiable
          const mostConfident = availableResults.reduce((max, r) => 
            r.confidence > max.confidence ? r : max
          );
          
          combinedAnalysis = {
            isAIGenerated: finalDecision,
            confidence: finalConfidence,
            authenticityScore: finalAuthenticity,
            description: mostConfident.description || '',
            evidence: allEvidence,
            aiSignals: allAISignals,
            manipulationSigns: allManipulationSigns,
            imageQuality: mostConfident.imageQuality || 'desconocida',
            recommendation: agreement === 'full' 
              ? `${availableResults.length} IAs concuerdan: ${finalDecision ? 'Imagen generada con IA' : 'Imagen real/auténtica'}`
              : `Análisis con ${availableResults.length} IAs - Resultado mayoritario usado`,
            agreement: agreement,
            source: availableResults.map(r => r.source).join(' + '),
            individualResults: {
              ...(analysisResults.openai && {
                openai: {
                  isAIGenerated: analysisResults.openai.isAIGenerated,
                  confidence: analysisResults.openai.confidence,
                  authenticityScore: analysisResults.openai.authenticityScore,
                  source: analysisResults.openai.source
                }
              }),
              ...(analysisResults.gemini && {
                gemini: {
                  isAIGenerated: analysisResults.gemini.isAIGenerated,
                  confidence: analysisResults.gemini.confidence,
                  authenticityScore: analysisResults.gemini.authenticityScore,
                  source: analysisResults.gemini.source
                }
              }),
              ...(analysisResults.groq && {
                groq: {
                  isAIGenerated: analysisResults.groq.isAIGenerated,
                  confidence: analysisResults.groq.confidence,
                  authenticityScore: analysisResults.groq.authenticityScore,
                  source: analysisResults.groq.source
                }
              })
            }
          };
        } else {
          // Si no hay análisis combinado, no debería llegar aquí
          toast({
            title: "Error",
            description: "No se pudo analizar la imagen con ninguna API",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        setVerificationData({
          type: 'image',
          checks: {
            imageAnalysis: combinedAnalysis,
            imageAnalysisComparison: analysisResults
          },
          credibilityScore: combinedAnalysis?.authenticityScore || 50,
          recommendation: combinedAnalysis?.isAIGenerated 
            ? { level: 'low', message: 'Imagen generada con IA', color: 'red' }
            : { level: 'high', message: 'Imagen real/auténtica', color: 'green' }
        });
        
        // Toast según acuerdo
        const allAgree = combinedAnalysis?.agreement === 'full';
        const numAPIs = Object.keys(analysisResults).length;
        toast({
          title: allAgree 
            ? `✓ Análisis completado - ${numAPIs} IAs concuerdan` 
            : `Análisis completado con ${numAPIs} IAs`,
          description: combinedAnalysis?.isAIGenerated 
            ? "⚠️ Imagen detectada como generada por IA"
            : "✓ Imagen identificada como real/auténtica",
        });
      } else if (selectedVideo) {
        // Analizar video extrayendo frames
        toast({
          title: "Analizando video...",
          description: "Extrayendo frames y analizando con IA. Esto puede tardar un momento.",
        });
        
        const videoAnalysis = await analyzeVideoWithAI(selectedVideo, (progress) => {
          if (progress.stage === 'extracting') {
            console.log('Extrayendo frames del video...');
          } else if (progress.stage === 'analyzing') {
            console.log(`Analizando frame ${progress.currentFrame}/${progress.totalFrames}...`);
          }
        });
        
        setVerificationData({
          type: 'video',
          checks: {
            videoAnalysis
          },
          credibilityScore: videoAnalysis.authenticityScore,
          recommendation: videoAnalysis.isAIGenerated 
            ? { level: 'low', message: 'Video posiblemente generado/editado con IA', color: 'red' }
            : { level: 'high', message: 'Video probablemente auténtico', color: 'green' }
        });
        
        toast({
          title: "✓ Análisis de video completado",
          description: videoAnalysis.verdict,
        });
      }

      setShowResults(true);
    } catch (error) {
      console.error('Error durante la verificación:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al verificar el contenido. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setLinkInput('');
    setSelectedImage(null);
    setSelectedVideo(null);
    setImagePreview(null);
    setShowResults(false);
    setVerificationData(null);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-100"
        >
          {/* Input Section */}
          <div className="space-y-6">
            {/* Link Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Link className="w-4 h-4 text-blue-600" />
                Enlace o URL
              </label>
              <motion.input
                type="text"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="https://ejemplo.com/contenido"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            {/* Upload Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Image Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Image className="w-4 h-4 text-purple-600" />
                  Subir imagen
                </label>
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                >
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {selectedImage ? selectedImage.name : 'Seleccionar imagen'}
                  </span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </motion.label>
              </div>

              {/* Video Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Video className="w-4 h-4 text-pink-600" />
                  Subir video
                </label>
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all duration-200"
                >
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {selectedVideo ? selectedVideo.name : 'Seleccionar video'}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </motion.label>
              </div>
            </div>

            {/* Verify Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleVerify}
                disabled={isLoading}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  'Verificando...'
                ) : (
                  <>
                    Verificar contenido
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading Animation */}
        <AnimatePresence>
          {isLoading && <LoadingAnimation />}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {showResults && (
            <VerificationResults 
              onReset={handleReset}
              hasLink={!!linkInput}
              hasImage={!!selectedImage}
              hasVideo={!!selectedVideo}
              verificationData={verificationData}
              imagePreview={imagePreview}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default VerificationBox;