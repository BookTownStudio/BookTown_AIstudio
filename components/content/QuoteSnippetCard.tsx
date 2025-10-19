
import React from 'react';
// FIX: Add file extensions to imports
import GlassCard from '../ui/GlassCard.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import Button from '../ui/Button.tsx';
import { useI18n } from '../../store/i18n.tsx';
// FIX: Add file extension to entities.ts import
import { Quote } from '../../types/entities.ts';
import { LikeIcon } from '../icons/LikeIcon.tsx';
import { ChatIcon } from '../icons/ChatIcon.tsx';
import { ShareIcon } from '../icons/ShareIcon.tsx';
import { BookmarkIcon } from '../icons/BookmarkIcon.tsx';

interface QuoteSnippetCardProps {
    quote: Quote;
}

const QuoteSnippetCard: React.FC<QuoteSnippetCardProps> = ({ quote }) => {
    const { lang, isRTL } = useI18n();
    return (
        <GlassCard>
            <BilingualText role="Quote">
                {lang === 'en' ? quote.textEn : quote.textAr}
            </BilingualText>
            <BilingualText role="Caption" className="mt-4">
                — {lang === 'en' ? quote.sourceEn : quote.sourceAr}
            </BilingualText>
            
            <div className={`mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button variant="icon" aria-label={lang === 'en' ? 'Like' : 'إعجاب'}>
                    <LikeIcon className="h-5 w-5" />
                </Button>
                 <Button variant="icon" aria-label={lang === 'en' ? 'Comment' : 'تعليق'}>
                    <ChatIcon className="h-5 w-5" />
                </Button>
                <Button variant="icon" aria-label={lang === 'en' ? 'Share' : 'مشاركة'}>
                    <ShareIcon className="h-5 w-5" />
                </Button>
                <div className="flex-grow"></div>
                 <Button variant="icon" aria-label={lang === 'en' ? 'Save' : 'حفظ'}>
                    <BookmarkIcon className="h-5 w-5" />
                </Button>
            </div>
        </GlassCard>
    );
};

export default QuoteSnippetCard;
