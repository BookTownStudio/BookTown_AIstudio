import React, { useState } from 'react';
// FIX: Add file extensions to imports
import { Post } from '../../types/entities.ts';
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

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { lang, isRTL } = useI18n();
    const { navigate, currentView } = useNavigation();
    const { data: book } = useBookCatalog(post.bookTagId);
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