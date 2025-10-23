import React, { useState } from 'react';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { LikeIcon } from '../icons/LikeIcon.tsx';
import { ShareIcon } from '../icons/ShareIcon.tsx';
import { useToggleBookOnShelf } from '../../lib/hooks/useToggleBookOnShelf.ts';
import { useUserShelves } from '../../lib/hooks/useUserShelves.ts';
import { useNavigation } from '../../store/navigation.tsx';
import { PostAttachment } from '../../types/entities.ts';
import { useAddReaction } from '../../lib/hooks/useLikeBook.ts';
import { useSaveBookmark } from '../../lib/hooks/useSaveQuote.ts';
import { useSaveQuote } from '../../lib/hooks/useSaveQuote.ts';
import { useFollowUser } from '../../lib/hooks/useFollowUser.ts';
import { useFollowAuthor } from '../../lib/hooks/useFollowAuthor.ts';
import { BookmarkIcon } from '../icons/BookmarkIcon.tsx';
import { ChevronDownIcon } from '../icons/ChevronDownIcon.tsx';

interface BookFlowActionsProps {
    entityType: 'book' | 'user' | 'quote' | 'venue' | 'event' | 'bookfair' | 'author';
    entityId: string;
}

const BookFlowActions: React.FC<BookFlowActionsProps> = ({ entityType, entityId }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { data: shelves } = useUserShelves();
    const { navigate, currentView } = useNavigation();

    // Polymorphic hooks
    const { mutate: toggleBookOnShelf } = useToggleBookOnShelf();
    const { mutate: saveQuote } = useSaveQuote();
    const { mutate: followUser } = useFollowUser();
    const { mutate: followAuthor } = useFollowAuthor();
    const { mutate: addReaction } = useAddReaction();
    const { mutate: saveBookmark } = useSaveBookmark();

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        switch (entityType) {
            case 'book':
                const wantToReadShelf = shelves?.find(s => s.id === 'want-to-read');
                if (wantToReadShelf) {
                    toggleBookOnShelf({ shelfId: wantToReadShelf.id, bookId: entityId });
                }
                break;
            case 'quote':
                saveQuote(entityId);
                break;
            case 'user':
                followUser(entityId);
                break;
            case 'author':
                followAuthor(entityId);
                break;
            default:
                console.log(`[Mock] Polymorphic 'Save' action for ${entityType} ${entityId}`);
                break;
        }
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        addReaction({ entityId, reaction: 'love' });
    };

    const handleBookmark = (e: React.MouseEvent) => {
        e.stopPropagation();
        saveBookmark(entityId);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        let attachment: PostAttachment | null = null;
        switch (entityType) {
            case 'book':
            case 'quote':
                attachment = { type: entityType, bookId: entityId, quoteId: entityId, quoteOwnerId: '' }; // simplified for mock
                break;
            case 'user':
                attachment = { type: 'author', authorId: entityId };
                break;
            default:
                break;
        }

        if (attachment) {
            navigate({
                type: 'immersive',
                id: 'postComposer',
                params: { from: currentView, attachment }
            });
        } else {
            console.log(`[Mock] Sharing ${entityType} ${entityId}`);
            if (navigator.share) {
                navigator.share({
                    title: `Check this out on BookTown!`,
                    text: `I found something cool on BookTown.`,
                    url: window.location.href,
                }).catch(console.error);
            }
        }
    };

    const actionButtons = [
        { icon: PlusIcon, handler: handleSave, label: 'Save', color: 'bg-indigo-500/70' },
        { icon: LikeIcon, handler: handleLike, label: 'Like', color: 'bg-red-500/70' },
        { icon: ShareIcon, handler: handleShare, label: 'Share', color: 'bg-blue-500/70' },
        { icon: BookmarkIcon, handler: handleBookmark, label: 'Bookmark', color: 'bg-emerald-500/70' },
    ];

    return (
        <div className="absolute bottom-24 right-4 z-10 flex flex-col items-center gap-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)'}}>
            <div className="flex flex-col-reverse items-center gap-4">
                 {actionButtons.map((btn, index) => (
                     <button
                        key={index}
                        onClick={btn.handler}
                        className={`
                            h-12 w-12 rounded-full ${btn.color} backdrop-blur-sm flex items-center justify-center text-white shadow-lg
                            transition-all duration-300 ease-in-out hover:scale-110
                            ${isExpanded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-0 pointer-events-none'}
                        `}
                        style={{ transitionDelay: `${isExpanded ? (3 - index) * 50 : 0}ms` }}
                        aria-label={btn.label}
                        tabIndex={isExpanded ? 0 : -1}
                    >
                        <btn.icon className="h-6 w-6" />
                    </button>
                ))}
            </div>
             <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-slate-800 shadow-lg transition-transform hover:scale-110" aria-label="Toggle actions">
                <ChevronDownIcon className={`h-8 w-8 transition-transform duration-300 ${!isExpanded ? 'rotate-180' : ''}`} />
            </button>
        </div>
    );
};

export default BookFlowActions;