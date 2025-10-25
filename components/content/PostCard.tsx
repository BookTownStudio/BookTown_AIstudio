import React, { useState } from 'react';
// FIX: Add file extensions to imports
import { Post, PostAttachment, Book } from '../../types/entities.ts';
import { useI18n } from '../../store/i18n.tsx';
import GlassCard from '../ui/GlassCard.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import Button from '../ui/Button.tsx';
import { LikeIcon } from '../icons/LikeIcon.tsx';
import { ChatIcon } from '../icons/ChatIcon.tsx';
import { RepostIcon } from '../icons/RepostIcon.tsx';
import { useBookCatalog } from '../../lib/hooks/useBookCatalog.ts';
import { ShareIcon } from '../icons/ShareIcon.tsx';
import { BookmarkIcon } from '../icons/BookmarkIcon.tsx';
import { useNavigation } from '../../store/navigation.tsx';
// FIX: Import QuoteIcon to resolve 'Cannot find name' error.
import { QuoteIcon } from '../icons/QuoteIcon.tsx';
import { useQuoteDetails } from '../../lib/hooks/useQuoteDetails.ts';
import { useUserProfile } from '../../lib/hooks/useUserProfile.ts';
import { useShelfEntries, useUserShelves } from '../../lib/hooks/useUserShelves.ts';
import { VenuesIcon } from '../icons/VenuesIcon.tsx';
import { useVenueDetails } from '../../lib/hooks/useVenueDetails.ts';
import InteractionRail from './InteractionRail.tsx';

interface PostCardProps {
    post: Post;
    viewMode?: 'list' | 'flow';
    onOpenDiscussion?: () => void;
    onNewPost?: () => void;
}

// --- Attachment Components ---

const BookAttachment: React.FC<{ bookId: string }> = ({ bookId }) => {
    const { lang, isRTL } = useI18n();
    const { data: book, isLoading } = useBookCatalog(bookId);
    const { navigate, currentView } = useNavigation();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (book) {
            navigate({ type: 'immersive', id: 'bookDetails', params: { bookId: book.id, from: currentView } });
        }
    }
    
    if (isLoading) return <div className="h-24 w-full bg-black/5 dark:bg-white/5 animate-pulse rounded-lg mt-3" />;
    if (!book) return null;

    return (
         <button onClick={handleClick} className="w-full text-left mt-3">
            <div className={`border border-black/10 dark:border-white/10 rounded-lg flex items-center gap-3 p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                 <img src={book.coverUrl} alt="book cover" className="h-16 w-11 rounded object-cover" />
                 <div>
                     <BilingualText className="font-semibold text-sm">{lang === 'en' ? book.titleEn : book.titleAr}</BilingualText>
                     <BilingualText role="Caption" className="!text-xs">{lang === 'en' ? book.authorEn : book.authorAr}</BilingualText>
                 </div>
             </div>
         </button>
    );
};


const QuoteAttachment: React.FC<{ quoteId: string, ownerId: string }> = ({ quoteId, ownerId }) => {
    const { lang } = useI18n();
    const { data: quote, isLoading } = useQuoteDetails(quoteId, ownerId);
    const { navigate, currentView } = useNavigation();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate({ type: 'immersive', id: 'quoteDetails', params: { quoteId, ownerId, from: currentView } });
    }
    
    if (isLoading || !quote) return <div className="h-24 w-full bg-black/5 dark:bg-white/5 animate-pulse rounded-lg mt-3" />;

    return (
        <button onClick={handleClick} className="w-full text-left">
            <div className="mt-3 border border-black/10 dark:border-white/10 rounded-lg p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <BilingualText role="Quote" className="!text-sm italic">
                    "{lang === 'en' ? quote.textEn : quote.textAr}"
                </BilingualText>
                <BilingualText role="Caption" className="mt-2 text-right">
                    — {lang === 'en' ? quote.sourceEn : quote.sourceAr}
                </BilingualText>
            </div>
        </button>
    );
};

const MediaAttachment: React.FC<{ url: string }> = ({ url }) => {
    return (
        <div className="mt-3 border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
            <img src={url} alt="Post attachment" className="w-full h-auto max-h-96 object-cover" />
        </div>
    );
};

const AuthorAttachment: React.FC<{ authorId: string }> = ({ authorId }) => {
    const { data: author, isLoading } = useUserProfile(authorId);
    
    if (isLoading || !author) return <div className="h-10 w-48 bg-black/5 dark:bg-white/5 animate-pulse rounded-full mt-3" />;

    return (
        <div className="mt-3">
             <div className="inline-flex items-center gap-2 p-2 pr-4 border border-black/10 dark:border-white/10 rounded-full">
                <img src={author.avatarUrl} alt={author.name} className="h-8 w-8 rounded-full" />
                <div>
                    <BilingualText className="font-semibold text-sm leading-tight">{author.name}</BilingualText>
                    <BilingualText role="Caption" className="!text-xs leading-tight">{author.handle}</BilingualText>
                </div>
            </div>
        </div>
    );
};

const ShelfAttachment: React.FC<{ shelfId: string, ownerId: string }> = ({ shelfId, ownerId }) => {
    const { lang } = useI18n();
    const { data: shelves } = useUserShelves(ownerId);
    const shelf = shelves?.find(s => s.id === shelfId);
    const { data: entries } = useShelfEntries(shelf?.id, ownerId);
    const bookIds = entries?.slice(0, 3).map(e => e.bookId) || [];
    const { data: book1 } = useBookCatalog(bookIds[0]);
    const { data: book2 } = useBookCatalog(bookIds[1]);
    const { data: book3 } = useBookCatalog(bookIds[2]);
    const bookCovers = [book1, book2, book3].filter(b => b && b.coverUrl).map(b => b!.coverUrl);

    if (!shelf) return <div className="h-24 w-full bg-black/5 dark:bg-white/5 animate-pulse rounded-lg mt-3" />;

    return (
        <div className="mt-3 border border-black/10 dark:border-white/10 rounded-lg p-3">
            <BilingualText role="Caption" className="!text-xs mb-2">{lang === 'en' ? 'From the shelf:' : 'من رف:'}</BilingualText>
            <div className="flex items-center gap-3">
                {bookCovers.length > 0 && (
                    <div className="flex -space-x-4">
                        {bookCovers.map((url, i) => (
                             <img key={i} src={url} alt="cover" className="h-12 w-8 rounded object-cover border-2 border-slate-200 dark:border-slate-900"/>
                        ))}
                    </div>
                )}
                <BilingualText className="font-semibold">{lang === 'en' ? shelf.titleEn : shelf.titleAr}</BilingualText>
            </div>
        </div>
    );
};

const VenueAttachment: React.FC<{ venueId: string }> = ({ venueId }) => {
    const { lang } = useI18n();
    const { data: venue, isLoading } = useVenueDetails(venueId);

    if (isLoading || !venue) return <div className="h-10 w-48 bg-black/5 dark:bg-white/5 animate-pulse rounded-full mt-3" />;

    const isEvent = 'dateTime' in venue;
    const name = isEvent ? (lang === 'en' ? venue.titleEn : venue.titleAr) : venue.name;
    const location = isEvent ? (venue.isOnline ? "Online Event" : (venue.venueName || '')) : venue.address;
    
    return (
        <div className="mt-3">
            <div className="inline-flex items-center gap-2 p-2 pr-3 border border-black/10 dark:border-white/10 rounded-full">
                <VenuesIcon className="h-6 w-6 text-slate-500 dark:text-white/60" />
                 <div>
                    <BilingualText className="font-semibold text-sm leading-tight">{name}</BilingualText>
                    <BilingualText role="Caption" className="!text-xs leading-tight">{location}</BilingualText>
                </div>
            </div>
        </div>
    )
}

const AttachmentRenderer: React.FC<{ attachment: PostAttachment }> = ({ attachment }) => {
    switch (attachment.type) {
        case 'book':
            return <BookAttachment bookId={attachment.bookId} />;
        case 'quote':
            return <QuoteAttachment quoteId={attachment.quoteId} ownerId={attachment.quoteOwnerId} />;
        case 'media':
            return <MediaAttachment url={attachment.url} />;
        case 'author':
            return <AuthorAttachment authorId={attachment.authorId} />;
        case 'shelf':
            return <ShelfAttachment shelfId={attachment.shelfId} ownerId={attachment.ownerId} />;
        case 'venue':
            return <VenueAttachment venueId={attachment.venueId} />;
        default:
            return null;
    }
};


const PostCard: React.FC<PostCardProps> = ({ post, viewMode = 'list', onOpenDiscussion, onNewPost }) => {
    const { lang, isRTL } = useI18n();
    const { navigate, currentView } = useNavigation();
    
    const bookIdForBackground = post.attachment?.type === 'book' ? post.attachment.bookId : post.bookTagId;
    const { data: book } = useBookCatalog(bookIdForBackground);

    const [showRepostMenu, setShowRepostMenu] = useState(false);

    const handleLike = () => console.log(`[Mock] Liked post ${post.id}`);

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

    const handleQuotePost = () => {
        navigate({ 
            type: 'immersive', 
            id: 'postComposer', 
            params: { from: currentView, attachment: { type: 'post', id: post.id } } 
        });
        setShowRepostMenu(false);
    }
    
    const handleProfileClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigate({ type: 'immersive', id: 'profile', params: { userId: post.authorId, from: currentView } });
    }

    // Unify attachment logic
    const effectiveAttachment = post.attachment ?? (post.bookTagId ? { type: 'book' as const, bookId: post.bookTagId } : null);

    if (viewMode === 'flow') {
        const backgroundUrl = book?.coverUrl || post.authorAvatar;
        const isBookPost = effectiveAttachment?.type === 'book';

        const handleNavigateToBook = () => {
            if (isBookPost && effectiveAttachment.bookId) {
                navigate({ type: 'immersive', id: 'bookDetails', params: { bookId: effectiveAttachment.bookId, from: currentView } });
            }
        };

        const mainClickHandler = (e: React.MouseEvent) => {
            // If the click originated inside any button, let that button handle it and do nothing here.
            if ((e.target as HTMLElement).closest('button')) {
                return;
            }

            if (isBookPost) {
                handleNavigateToBook();
            } else if (onOpenDiscussion) {
                onOpenDiscussion();
            }
        };

        return (
            <div 
                className="relative h-full w-full flex-shrink-0 cursor-pointer text-white overflow-hidden"
                onClick={mainClickHandler}
            >
                <img src={backgroundUrl} alt="Post background" className="absolute inset-0 w-full h-full object-cover blur-md scale-110" />
                <div className="absolute inset-0 bg-black/60" />

                {/* User Info - Bottom Left */}
                <div className="absolute bottom-28 left-6 z-20">
                    <button onClick={handleProfileClick} className="flex items-center gap-3 text-left">
                        <img src={post.authorAvatar} alt={post.authorName} className="h-10 w-10 rounded-full border-2 border-white/30" />
                        <div>
                            <BilingualText className="font-bold !text-white drop-shadow-md">{post.authorName}</BilingualText>
                            <BilingualText role="Caption" className="!text-white/80 drop-shadow-md">{post.authorHandle}</BilingualText>
                        </div>
                    </button>
                </div>

                {/* Centered Content */}
                <div className="relative z-10 flex flex-col h-full justify-center items-center p-8 pr-24 text-center pt-20">
                    {isBookPost && book ? (
                        <>
                            <div className="relative w-64 shadow-2xl shadow-black/50" style={{ perspective: '1000px' }}>
                                <img 
                                    src={book.coverUrl} 
                                    alt={lang === 'en' ? book.titleEn : book.titleAr}
                                    className="w-full h-auto rounded-lg"
                                    style={{ transform: 'rotateY(-10deg) rotateX(2deg) scale(1.05)' }}
                                />
                                <div className="absolute top-0 left-0 w-full h-full rounded-lg" style={{ background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)' }}></div>
                            </div>

                            {post.content && (
                                <div className="mt-[-40px] relative z-10 max-w-sm">
                                    <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl shadow-lg">
                                        <BilingualText role="Body" className="!text-white/90">
                                            "{post.content}"
                                        </BilingualText>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        // Original render for non-book posts
                        <>
                            <BilingualText role="Body" className="text-lg max-w-lg line-clamp-6 mb-4">
                                {post.content}
                            </BilingualText>
                            
                            {effectiveAttachment && (
                                <div className="w-full max-w-md">
                                    <AttachmentRenderer attachment={effectiveAttachment} />
                                </div>
                            )}
                            
                            <div className="mt-4 flex items-center gap-4 text-sm text-white/80">
                                 <BilingualText role="Caption">
                                    <span className="font-bold">{post.stats.likes}</span> {lang === 'en' ? 'Likes' : 'إعجاب'}
                                </BilingualText>
                                <BilingualText role="Caption">
                                    <span className="font-bold">{post.stats.comments}</span> {lang === 'en' ? 'Comments' : 'تعليق'}
                                </BilingualText>
                                <BilingualText role="Caption">
                                    <span className="font-bold">{post.stats.reposts}</span> {lang === 'en' ? 'Reposts' : 'إعادة نشر'}
                                </BilingualText>
                            </div>
                        </>
                    )}
                </div>
                
                <InteractionRail post={post} onOpenDiscussion={onOpenDiscussion!} onNewPost={onNewPost} />
            </div>
        );
    }


    return (
        <GlassCard className="!p-4">
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <button onClick={handleProfileClick}><img src={post.authorAvatar} alt={post.authorName} className="h-12 w-12 rounded-full flex-shrink-0" /></button>
                <div className="flex-grow">
                    <button onClick={handleProfileClick} className="w-full text-left">
                        <div className={`flex items-baseline gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <BilingualText className="font-bold">{post.authorName}</BilingualText>
                            <BilingualText role="Caption">{post.authorHandle}</BilingualText>
                            <BilingualText role="Caption">· {timeAgo(post.timestamp)}</BilingualText>
                        </div>
                    </button>
                    <BilingualText role="Body" className="mt-1">
                        {post.content}
                    </BilingualText>
                    
                    {effectiveAttachment && <AttachmentRenderer attachment={effectiveAttachment} />}

                    <div className={`mt-3 flex items-center justify-between text-slate-500 dark:text-white/60 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Button variant="ghost" className="!text-inherit hover:!text-sky-400 !px-2">
                            <ChatIcon className="h-5 w-5 mr-2" /> <span className="text-sm">{post.stats.comments}</span>
                        </Button>

                        <div className="relative">
                            <Button variant="ghost" className="!text-inherit hover:!text-green-400 !px-2" onClick={() => setShowRepostMenu(!showRepostMenu)}>
                                <RepostIcon className="h-5 w-5 mr-2" /> <span className="text-sm">{post.stats.reposts}</span>
                            </Button>
                            {showRepostMenu && (
                                <div onMouseLeave={() => setShowRepostMenu(false)} className="absolute bottom-full mb-2 z-10">
                                    <GlassCard className="!p-1">
                                        <button onClick={() => console.log('Repost!')} className="flex items-center gap-2 w-full text-left px-3 py-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-sm">
                                            <RepostIcon className="h-4 w-4" /> Repost
                                        </button>
                                        <button onClick={handleQuotePost} className="flex items-center gap-2 w-full text-left px-3 py-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-sm">
                                            <QuoteIcon className="h-4 w-4" /> Quote Post
                                        </button>
                                    </GlassCard>
                                </div>
                            )}
                        </div>
                        
                        <Button variant="ghost" className="!text-inherit hover:!text-pink-400 !px-2" onClick={handleLike}>
                            <LikeIcon className="h-5 w-5 mr-2" /> <span className="text-sm">{post.stats.likes}</span>
                        </Button>
                         
                        <div className="flex items-center gap-1">
                            <Button variant="icon" className="!text-inherit hover:!text-accent"><ShareIcon className="h-5 w-5" /></Button>
                            <Button variant="icon" className="!text-inherit hover:!text-accent"><BookmarkIcon className="h-5 w-5" /></Button>
                        </div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default PostCard;
