import React from 'react';
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
import { useI18n } from '../../store/i18n.tsx';

interface BookFlowActionsProps {
    entityType: 'book' | 'user' | 'quote' | 'venue' | 'event' | 'bookfair' | 'author';
    entityId: string;
}

const ActionButton: React.FC<{ icon: React.FC<any>, label: string, onClick: (e: React.MouseEvent) => void }> = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group" aria-label={label}>
        <div className="h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:bg-white/20">
            <Icon className="h-6 w-6" />
        </div>
    </button>
);


const BookFlowActions: React.FC<BookFlowActionsProps> = ({ entityType, entityId }) => {
    const { data: shelves } = useUserShelves();
    const { navigate, currentView } = useNavigation();
    const { lang } = useI18n();

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
            case 'author':
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


    return (
        <div 
            className="absolute bottom-28 right-4 z-20 flex flex-col items-center gap-4" 
            style={{ paddingBottom: 'env(safe-area-inset-bottom)'}}
        >
            <ActionButton icon={PlusIcon} onClick={handleSave} label={lang === 'en' ? 'Save' : 'حفظ'} />
            <ActionButton icon={LikeIcon} onClick={handleLike} label={lang === 'en' ? 'Like' : 'إعجاب'} />
            <ActionButton icon={ShareIcon} onClick={handleShare} label={lang === 'en' ? 'Share' : 'مشاركة'} />
            <ActionButton icon={BookmarkIcon} onClick={handleBookmark} label={lang === 'en' ? 'Bookmark' : 'حفظ'} />
        </div>
    );
};

export default BookFlowActions;