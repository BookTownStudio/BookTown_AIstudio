import React from 'react';
import { Bookmark, Book, Quote, Post, Author, Venue, Event } from '../../types/entities.ts';
import { useI18n } from '../../store/i18n.tsx';
// FIX: The 'View' type is not exported from 'store/navigation.tsx'. It is imported from 'types/navigation.ts' instead.
import { useNavigation } from '../../store/navigation.tsx';
import { View } from '../../types/navigation.ts';
import GlassCard from '../ui/GlassCard.tsx';
import BilingualText from '../ui/BilingualText.tsx';

// Data hooks
import { useBookCatalog } from '../../lib/hooks/useBookCatalog.ts';
import { useQuoteDetails } from '../../lib/hooks/useQuoteDetails.ts';
import { usePostDetails } from '../../lib/hooks/usePostDetails.ts';
import { useAuthorDetails } from '../../lib/hooks/useAuthorDetails.ts';
import { useVenueDetails } from '../../lib/hooks/useVenueDetails.ts';

// Icons
import { BookIcon } from '../icons/BookIcon.tsx';
import { QuoteIcon } from '../icons/QuoteIcon.tsx';
import { ChatIcon } from '../icons/ChatIcon.tsx';
import { UserIcon } from '../icons/UserIcon.tsx';
import { VenuesIcon } from '../icons/VenuesIcon.tsx';

// --- Helper Components ---

const LoadingCard = () => (
    <GlassCard className="!p-3">
        <div className="h-16 w-full bg-white/5 animate-pulse rounded-md" />
    </GlassCard>
);

interface ItemProps {
    bookmark: Bookmark;
    lang: 'en' | 'ar';
    navigate: (view: View) => void;
    currentView: View;
}

// --- Item Renderers ---

const BookItem: React.FC<ItemProps> = ({ bookmark, lang, navigate, currentView }) => {
    const { data: book, isLoading } = useBookCatalog(bookmark.entityId);
    const handlePress = () => navigate({ type: 'immersive', id: 'bookDetails', params: { bookId: bookmark.entityId, from: currentView } });

    if (isLoading) return <LoadingCard />;
    if (!book) return null;

    return (
        <button onClick={handlePress} className="w-full text-left">
            <GlassCard className="!p-3 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                    <img src={book.coverUrl} alt="cover" className="h-16 w-11 rounded-md object-cover flex-shrink-0" />
                    <div className="overflow-hidden">
                        <BilingualText className="font-semibold truncate">{lang === 'en' ? book.titleEn : book.titleAr}</BilingualText>
                        <BilingualText role="Caption" className="truncate">{lang === 'en' ? book.authorEn : book.authorAr}</BilingualText>
                    </div>
                </div>
            </GlassCard>
        </button>
    );
};

const QuoteItem: React.FC<ItemProps> = ({ bookmark, lang, navigate, currentView }) => {
    const { data: quote, isLoading } = useQuoteDetails(bookmark.entityId, bookmark.quoteOwnerId);
    const handlePress = () => navigate({ type: 'immersive', id: 'quoteDetails', params: { quoteId: bookmark.entityId, ownerId: bookmark.quoteOwnerId, from: currentView } });

    if (isLoading) return <LoadingCard />;
    if (!quote) return null;

    return (
        <button onClick={handlePress} className="w-full text-left">
            <GlassCard className="!p-4 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <BilingualText role="Quote" className="!text-base line-clamp-2">"{lang === 'en' ? quote.textEn : quote.textAr}"</BilingualText>
                <BilingualText role="Caption" className="mt-2 text-right truncate">— {lang === 'en' ? quote.sourceEn : quote.sourceAr}</BilingualText>
            </GlassCard>
        </button>
    );
};

const PostItem: React.FC<ItemProps> = ({ bookmark, lang, navigate, currentView }) => {
    const { data: post, isLoading } = usePostDetails(bookmark.entityId);

    if (isLoading) return <LoadingCard />;
    if (!post) return null;

    return (
        <GlassCard className="!p-3">
            <div className="flex items-start gap-3">
                <img src={post.authorAvatar} alt={post.authorName} className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="overflow-hidden">
                    <div className="flex items-baseline gap-2">
                        <BilingualText className="font-semibold truncate">{post.authorName}</BilingualText>
                        <BilingualText role="Caption" className="truncate flex-shrink-0">{post.authorHandle}</BilingualText>
                    </div>
                    <BilingualText role="Body" className="mt-1 !text-sm line-clamp-2">{post.content}</BilingualText>
                </div>
            </div>
        </GlassCard>
    );
};

const AuthorItem: React.FC<ItemProps> = ({ bookmark, lang, navigate, currentView }) => {
    const { data: author, isLoading } = useAuthorDetails(bookmark.entityId);
    const handlePress = () => navigate({ type: 'immersive', id: 'authorDetails', params: { authorId: bookmark.entityId, from: currentView } });

    if (isLoading) return <LoadingCard />;
    if (!author) return null;

    return (
        <button onClick={handlePress} className="w-full text-left">
            <GlassCard className="!p-3 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                    <img src={author.avatarUrl} alt="avatar" className="h-12 w-12 rounded-full object-cover flex-shrink-0" />
                    <div className="overflow-hidden">
                        <BilingualText className="font-semibold truncate">{lang === 'en' ? author.nameEn : author.nameAr}</BilingualText>
                        <BilingualText role="Caption" className="truncate">{lang === 'en' ? author.countryEn : author.countryAr}</BilingualText>
                    </div>
                </div>
            </GlassCard>
        </button>
    );
};

const VenueItem: React.FC<ItemProps> = ({ bookmark, lang, navigate, currentView }) => {
    const { data: venue, isLoading } = useVenueDetails(bookmark.entityId);
    const handlePress = () => navigate({ type: 'immersive', id: 'venueDetails', params: { venueId: bookmark.entityId, from: currentView } });

    if (isLoading) return <LoadingCard />;
    if (!venue) return null;

    const isEvent = 'dateTime' in venue;
    const name = isEvent ? (lang === 'en' ? venue.titleEn : venue.titleAr) : venue.name;
    const subtitle = isEvent ? (venue.isOnline ? "Online Event" : venue.venueName) : venue.address;

    return (
        <button onClick={handlePress} className="w-full text-left">
            <GlassCard className="!p-3 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                    <img src={venue.imageUrl} alt="venue image" className="h-16 w-16 rounded-md object-cover flex-shrink-0" />
                    <div className="overflow-hidden">
                        <BilingualText className="font-semibold truncate">{name}</BilingualText>
                        <BilingualText role="Caption" className="truncate">{subtitle}</BilingualText>
                    </div>
                </div>
            </GlassCard>
        </button>
    );
};

// --- Main Component ---
const BookmarkItem: React.FC<{ bookmark: Bookmark }> = ({ bookmark }) => {
    const { lang } = useI18n();
    const { navigate, currentView } = useNavigation();
    
    const commonProps = { bookmark, lang, navigate, currentView };

    switch(bookmark.type) {
        case 'book': return <BookItem {...commonProps} />;
        case 'quote': return <QuoteItem {...commonProps} />;
        case 'post': return <PostItem {...commonProps} />;
        case 'author': return <AuthorItem {...commonProps} />;
        case 'venue':
        case 'event':
            return <VenueItem {...commonProps} />;
        default:
            return null;
    }
};

export default BookmarkItem;
