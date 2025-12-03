import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

const ContentDisplay = ({ content, maxInitialLength = 500 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  if (!content) return null;
  
  const shouldTruncate = content.length > maxInitialLength;
  const displayContent = isExpanded || !shouldTruncate 
    ? content 
    : content.substring(0, maxInitialLength) + '...';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="prose prose-sm max-w-none">
          <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
            {displayContent}
          </p>
        </div>
        
        {/* Gradient overlay when collapsed */}
        {shouldTruncate && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        {shouldTruncate && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Ver menos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Leer completo ({Math.ceil((content.length - maxInitialLength) / 100)} líneas más)
              </>
            )}
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              ¡Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar texto
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ContentDisplay;
