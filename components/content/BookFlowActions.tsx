import React, { useState } from 'react';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { LikeIcon } from '../icons/LikeIcon.tsx';
import { ShareIcon } from '../icons/ShareIcon.tsx';
import { QuoteIcon } from '../icons/QuoteIcon.tsx';
import { useToggleBookOnShelf } from '../../lib/hooks/useToggleBookOnShelf.ts';
import { useLikeBook } from '../../lib/hooks/useLikeBook.ts';
import { useSaveQuote } from '../../lib/hooks/useSaveQuote.ts';
import { useUserShelves } from '../../lib/hooks/useUserShelves.ts';

interface BookFlowActionsProps {
    bookId: string;
    quoteId: string; // To save the quote
}

const BookFlowActions: React.FC<BookFlowActionsProps> = ({ bookId, quoteId }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { data: shelves } = useUserShelves();
    const { mutate: toggleBook } = useToggleBookOnShelf();
    const { mutate: likeBook } = useLikeBook();
    const { mutate: saveQuote } = useSaveQuote();

    const handleToggleWantToRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        const wantToReadShelf = shelves?.find(s => s.id === 'want-to-read');
        if (wantToReadShelf) {
            toggleBook({ shelfId: wantToReadShelf.id, bookId });
            console.log(`[Mock] Toggling book ${bookId} on 'Want to Read' shelf.`);
        }
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        likeBook(bookId);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log(`[Mock] Sharing book ${bookId}`);
    };

    const handleSaveQuote = (e: React.MouseEvent) => {
        e.stopPropagation();
        saveQuote(quoteId);
    };

    const actionButtons = [
        { icon: PlusIcon, handler: handleToggleWantToRead, label: 'Add to Shelf' },
        { icon: LikeIcon, handler: handleLike, label: 'Like' },
        { icon: ShareIcon, handler: handleShare, label: 'Share' },
        { icon: QuoteIcon, handler: handleSaveQuote, label: 'Save Quote' },
    ];

    return (
        <div className="absolute bottom-24 right-2 z-10 flex flex-col items-center gap-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)'}}>
             {isExpanded && (
                <div className="flex flex-col-reverse items-center gap-4">
                     {actionButtons.map((btn, index) => (
                         <button key={index} onClick={btn.handler} className="h-12 w-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-transform hover:scale-110" aria-label={btn.label}>
                            <btn.icon className="h-6 w-6" />
                        </button>
                    ))}
                </div>
            )}
             <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-slate-800 shadow-lg transition-transform hover:scale-110" aria-label="Toggle actions">
                <PlusIcon className={`h-8 w-8 transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`} />
            </button>
        </div>
    );
};

export default BookFlowActions;