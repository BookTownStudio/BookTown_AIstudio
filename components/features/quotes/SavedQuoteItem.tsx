
import React from 'react';
// FIX: Add file extensions to imports
import GlassCard from '../../ui/GlassCard.tsx';
import BilingualText from '../../ui/BilingualText.tsx';
import Button from '../../ui/Button.tsx';
import { useI18n } from '../../../store/i18n.tsx';
import { Quote } from '../../../types/entities.ts';
import { HighlightIcon } from '../../icons/HighlightIcon.tsx';
import { ShareIcon } from '../../icons/ShareIcon.tsx';
import { CogIcon } from '../../icons/CogIcon.tsx';

interface SavedQuoteItemProps {
    quote: Quote;
}

const SavedQuoteItem: React.FC<SavedQuoteItemProps> = ({ quote }) => {
    const { lang } = useI18n();
    return (
        <GlassCard>
            <BilingualText role="Quote" className="text-white">
                "{lang === 'en' ? quote.textEn : quote.textAr}"
            </BilingualText>
            <BilingualText role="Caption" className="mt-4 block text-right">
                — {lang === 'en' ? quote.sourceEn : quote.sourceAr}
            </BilingualText>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                <Button variant="icon" aria-label="Highlight"><HighlightIcon className="h-5 w-5" /></Button>
                <Button variant="icon" aria-label="Share"><ShareIcon className="h-5 w-5" /></Button>
                <div className="flex-grow"></div>
                <Button variant="icon" aria-label="Options"><CogIcon className="h-5 w-5" /></Button>
            </div>
        </GlassCard>
    );
};

export default SavedQuoteItem;
