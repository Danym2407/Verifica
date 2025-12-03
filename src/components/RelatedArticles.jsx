import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, ChevronRight, Newspaper } from 'lucide-react';

const RelatedArticles = ({ articles, domain }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  if (!articles || articles.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-blue-500 rounded-lg">
          <Newspaper className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-lg">
            Artículos Relacionados de {domain}
          </h4>
          <p className="text-sm text-gray-600">
            Otros artículos publicados por esta fuente
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {articles.map((article, index) => (
          <motion.a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="block group"
          >
            <div className={`
              bg-white rounded-xl p-4 border-2 transition-all duration-300
              ${hoveredIndex === index 
                ? 'border-blue-400 shadow-lg transform scale-[1.02]' 
                : 'border-gray-200 hover:border-blue-300 shadow-sm'
              }
            `}>
              <div className="flex gap-4">
                {/* Imagen del artículo */}
                {article.urlToImage ? (
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                            <svg class="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        `;
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <Newspaper className="w-10 h-10 text-blue-400" />
                  </div>
                )}

                {/* Contenido del artículo */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h5>
                  
                  {article.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {article.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {article.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    
                    {article.author && (
                      <span className="truncate">
                        Por {article.author}
                      </span>
                    )}
                  </div>
                </div>

                {/* Ícono de enlace externo */}
                <div className="flex-shrink-0 flex items-center">
                  <div className={`
                    p-2 rounded-lg transition-all duration-300
                    ${hoveredIndex === index 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500'
                    }
                  `}>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Nota informativa */}
      <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 flex items-start gap-2">
          <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Estos artículos del mismo dominio ayudan a verificar que la fuente tiene un historial real de publicaciones y no es un sitio creado recientemente para difundir información falsa.
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default RelatedArticles;
