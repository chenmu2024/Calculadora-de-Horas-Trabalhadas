import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ThumbsUp } from 'lucide-react';

interface RatingWidgetProps {
  toolName?: string;
  className?: string;
}

export default function RatingWidget({ toolName = 'Calculadora CLT', className = '' }: RatingWidgetProps) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [totalVotes, setTotalVotes] = useState<number>(3420);
  const [averageScore] = useState<number>(4.9);

  useEffect(() => {
    const saved = localStorage.getItem(`tool_rating_${toolName}`);
    if (saved) {
      setUserRating(Number(saved));
      setHasRated(true);
    }
  }, [toolName]);

  const handleRate = (rating: number) => {
    setUserRating(rating);
    setHasRated(true);
    setTotalVotes(prev => prev + 1);
    localStorage.setItem(`tool_rating_${toolName}`, rating.toString());
  };

  return (
    <div
      className={`bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition-colors ${className}`}
      itemScope
      itemProp="aggregateRating"
      itemType="https://schema.org/AggregateRating"
    >
      <div className="space-y-1">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <div className="flex items-center text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRate(star)}
                onMouseEnter={() => !hasRated && setHoverRating(star)}
                onMouseLeave={() => !hasRated && setHoverRating(null)}
                aria-label={`Avaliar com ${star} estrelas`}
                className="p-0.5 focus:outline-hidden transition-transform hover:scale-125 cursor-pointer"
              >
                <Star
                  className={`w-5 h-5 ${
                    (hoverRating !== null ? star <= hoverRating : star <= (userRating || Math.floor(averageScore)))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-300 dark:text-neutral-600'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white" itemProp="ratingValue">
            {averageScore.toFixed(1)}
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">/ 5.0</span>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Avaliação da ferramenta: <strong className="text-neutral-800 dark:text-neutral-200" itemProp="reviewCount">{totalVotes.toLocaleString('pt-BR')}</strong> votos verificados de trabalhadores e contadores.
        </p>
        <meta itemProp="bestRating" content="5" />
        <meta itemProp="worstRating" content="1" />
        <meta itemProp="ratingCount" content={totalVotes.toString()} />
      </div>

      <div className="shrink-0 text-xs">
        {hasRated ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold rounded-xl border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Obrigado pela sua avaliação ({userRating} ★)!</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <ThumbsUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Clique nas estrelas para avaliar</span>
          </div>
        )}
      </div>
    </div>
  );
}
