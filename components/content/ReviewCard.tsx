import React from 'react';
import { Review } from '../../types/entities.ts';
import { useI18n } from '../../store/i18n.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import { StarIcon } from '../icons/StarIcon.tsx';

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
    const { isRTL, lang } = useI18n();

    const timeAgo = (dateString: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + (lang === 'en' ? "y" : "س");
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + (lang === 'en' ? "mo" : "ش");
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + (lang === 'en' ? "d" : "ي");
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + (lang === 'en' ? "h" : "س");
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + (lang === 'en' ? "m" : "د");
        return Math.floor(seconds) + (lang === 'en' ? "s" : "ث");
    }

    return (
        <div className="py-4 border-b border-white/10 last:border-b-0">
            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <img src={review.authorAvatar} alt={review.authorName} className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-grow">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div>
                            <BilingualText className="font-semibold">{review.authorName}</BilingualText>
                            <BilingualText role="Caption">{`${review.authorHandle} · ${timeAgo(review.timestamp)}`}</BilingualText>
                        </div>
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-slate-600'}`} />
                            ))}
                        </div>
                    </div>
                    <BilingualText role="Body" className="mt-2 text-white/80">
                        {review.text}
                    </BilingualText>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
