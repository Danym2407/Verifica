import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

/**
 * Componente para mostrar los fact-checks encontrados
 */
const FactCheckCard = ({ factCheck, index }) => {
  const claim = factCheck.text || 'Sin descripción';
  const claimReview = factCheck.claimReview?.[0];
  const publisher = claimReview?.publisher?.name || 'Desconocido';
  const rating = claimReview?.textualRating || 'Sin calificar';
  const url = claimReview?.url;
  
  // Determinar el icono y color según el rating
  const getRatingInfo = (rating) => {
    const ratingLower = rating.toLowerCase();
    
    if (ratingLower.includes('true') || ratingLower.includes('verdadero')) {
      return {
        icon: CheckCircle2,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200'
      };
    } else if (ratingLower.includes('false') || ratingLower.includes('falso')) {
      return {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200'
      };
    } else {
      return {
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200'
      };
    }
  };

  const ratingInfo = getRatingInfo(rating);
  const RatingIcon = ratingInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-xl border-2 ${ratingInfo.border} ${ratingInfo.bg}`}
    >
      <div className="flex items-start gap-3">
        <RatingIcon className={`w-6 h-6 ${ratingInfo.color} flex-shrink-0 mt-1`} />
        <div className="flex-1">
          <p className="text-gray-900 font-medium mb-2">{claim}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className={`font-semibold ${ratingInfo.color}`}>
              {rating}
            </span>
            <span className="text-gray-500">por {publisher}</span>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
              >
                Ver detalles
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FactCheckCard;
