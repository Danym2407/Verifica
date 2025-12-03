import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Shield } from 'lucide-react';

const LoadingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Shield className="w-16 h-16 text-blue-600" />
        </motion.div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-gray-900">Analizando contenido</h3>
          <p className="text-gray-600">Esto puede tomar unos segundos...</p>
        </div>

        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-blue-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-md space-y-3">
          {['Verificando autenticidad...', 'Analizando patrones...', 'Comparando con bases de datos...'].map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.5 }}
              className="flex items-center gap-3 text-sm text-gray-600"
            >
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              {text}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingAnimation;