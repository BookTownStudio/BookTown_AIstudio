import React, { useState } from 'react';
import { StarIcon } from '../icons/StarIcon.tsx';

interface StarRatingInputProps {
    rating: number; // 0-5
    onRatingChange: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ rating, onRatingChange, size = 'md' }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const sizeClasses = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-10 w-10',
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => onRatingChange(star)}
                    className="focus:outline-none appearance-none p-0 border-0 bg-transparent"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                    <StarIcon
                        className={`
                            ${sizeClasses[size]}
                            transition-colors duration-200
                            ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-slate-600 dark:text-white/40'}
                        `}
                    />
                </button>
            ))}
        </div>
    );
};

export default StarRatingInput;
