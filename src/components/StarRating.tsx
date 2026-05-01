import { Star, StarHalf } from 'lucide-react';
import { getStarArray } from '../utils/helpers';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
}

export default function StarRating({
  rating,
  size = 'md',
  showValue = false,
  reviewCount,
}: StarRatingProps) {
  const stars = getStarArray(rating);
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((starType, index) => {
          if (starType === 'full') {
            return (
              <Star
                key={index}
                className={`${sizeClasses[size]} fill-amber-400 text-amber-400`}
              />
            );
          }
          if (starType === 'half') {
            return (
              <StarHalf
                key={index}
                className={`${sizeClasses[size]} fill-amber-400 text-amber-400`}
              />
            );
          }
          return (
            <Star
              key={index}
              className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {rating}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
}
