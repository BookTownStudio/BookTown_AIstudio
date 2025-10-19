import React, { useState } from 'react';
// FIX: Add file extensions to imports
import { Post, PostAttachment } from '../../types/entities.ts';
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
import useLongPress from '../../lib/hooks/useLongPress.ts';
import { LightbulbIcon } from '../icons/LightbulbIcon.tsx';
import { ClapIcon } from '../icons/ClapIcon.tsx';
import { LaughIcon } from '../icons/LaughIcon.tsx';
import { ThumbsDownIcon } from '../icons/ThumbsDownIcon.tsx';
import { useNavigation } from '../../store/navigation.tsx';
// FIX: Import QuoteIcon to resolve 'Cannot find name' error.
import { QuoteIcon } from '../icons/QuoteIcon.tsx';
import { useQuoteDetails } from '../../lib/hooks/useQuoteDetails.ts';
import { useUserProfile } from '../../lib/hooks/useUserProfile.ts';
import { useShelfEntries, useUserShelves } from '../../lib/hooks/useUserShelves.ts';
import { VenuesIcon } from '../icons/VenuesIcon.tsx';


interface PostCardProps {
    post: Post;
}

const ReactionMenu: React.FC<{ onSelect: (reaction: string) => void }> = ({ onSelect }) => {
    const reactions = [
        { name: 'Insightful', icon: LightbulbIcon },
        { name: 'Appreciate', icon: ClapIcon },
        { name: 'Funny', icon: LaughIcon },
        { name: 'Dislike', icon: ThumbsDownIcon },
    ];
    return (
        <GlassCard className="absolute bottom-full mb-2 flex items-center gap-1 !p-1.5">
            {reactions.map(r => (
                <Button key={r.name} variant="icon" className="!w-10 !h-10" onClick={() => onSelect(r.name)}>
                    <r.icon className="h-6 w-6" />
                </Button>
            ))}
        </GlassCard>
    );
};

// --- Attachment Components ---

const QuoteAttachment: React.FC<{ quoteId: string, ownerId: string }> = ({ quoteId, ownerId }) => {
    const { lang } = useI18n();
    const { data: quote, isLoading } = useQuoteDetails(quoteId, ownerId);
    
    if (isLoading || !quote) return <div className="h-24 w-full bg-black/5 dark:bg-white/5 animate-pulse rounded-lg mt-3" />;

    return (
        <div className="mt-3 border border-black/10 dark:border-white/10 rounded-lg p-3">
            <BilingualText role="Quote" className="!text-sm italic">
                "{lang === 'en' ? quote.textEn : quote.textAr}"
            </BilingualText>
            <BilingualText role="Caption" className="mt-2 text-right">
                — {lang === 'en' ? quote.sourceEn : quote.sourceAr}
            </BilingualText>
        </div>
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

const VenueAttachment: React.FC<{ name: string, location: string }> = ({ name, location }) => {
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
        case 'quote':
            return <QuoteAttachment quoteId={attachment.quoteId} ownerId={attachment.quoteOwnerId} />;
        case 'media':
            return <MediaAttachment url={attachment.url} />;
        case 'author':
            return <AuthorAttachment authorId={attachment.authorId} />;
        case 'shelf':
            return <ShelfAttachment shelfId={attachment.shelfId} ownerId={attachment.ownerId} />;
        case 'venue':
            return <VenueAttachment name={attachment.name} location={attachment.location} />;
        default:
            return null;
    }
};


const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { lang, isRTL } = useI18n();
    const { navigate, currentView } = useNavigation();
    
    const bookId = post.attachment?.type === 'book' ? post.attachment.bookId : post.bookTagId;
    const { data: book } = useBookCatalog(bookId);

    const [showReactionMenu, setShowReactionMenu] = useState(false);
    const [showRepostMenu, setShowRepostMenu] = useState(false);

    const handleLike = () => console.log(`[Mock] Liked post ${post.id}`);
    const handleLongPress = () => setShowReactionMenu(true);
    const longPressEvents = useLongPress(handleLongPress, handleLike, { delay: 300 });

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
    
    return (
        <GlassCard className="!p-4">
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <img src={post.authorAvatar} alt={post.authorName} className="h-12 w-12 rounded-full flex-shrink-0" />
                <div className="flex-grow">
                    <div className={`flex items-baseline gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <BilingualText className="font-bold">{post.authorName}</BilingualText>
                        <BilingualText role="Caption">{post.authorHandle}</BilingualText>
                        <BilingualText role="Caption">· {timeAgo(post.timestamp)}</BilingualText>
                    </div>
                    <BilingualText role="Body" className="mt-1">
                        {post.content}
                    </BilingualText>
                    
                    {book && (
                         <div className={`mt-3 border border-black/10 dark:border-white/10 rounded-lg flex items-center gap-3 p-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                             <img src={book.coverUrl} alt="book cover" className="h-16 w-11 rounded object-cover" />
                             <div>
                                 <BilingualText className="font-semibold text-sm">{lang === 'en' ? book.titleEn : book.titleAr}</BilingualText>
                                 <BilingualText role="Caption" className="!text-xs">{lang === 'en' ? book.authorEn : book.authorAr}</BilingualText>
                             </div>
                         </div>
                    )}

                    {post.attachment && post.attachment.type !== 'book' && <AttachmentRenderer attachment={post.attachment} />}

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
                        
                        <div className="relative" onMouseLeave={() => setShowReactionMenu(false)}>
                            <Button variant="ghost" className="!text-inherit hover:!text-pink-400 !px-2" {...longPressEvents}>
                                <LikeIcon className="h-5 w-5 mr-2" /> <span className="text-sm">{post.stats.likes}</span>
                            </Button>
                            {showReactionMenu && <ReactionMenu onSelect={(r) => { console.log(r); setShowReactionMenu(false); }} />}
                        </div>
                         
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
