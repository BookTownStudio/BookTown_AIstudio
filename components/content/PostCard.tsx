
import React from 'react';
// FIX: Add file extensions to imports
import { Post } from '../../types/entities.ts';
import { useI18n } from '../../store/i18n.tsx';
import GlassCard from '../ui/GlassCard.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import Button from '../ui/Button.tsx';
import { LikeIcon } from '../icons/LikeIcon.tsx';
import { ChatIcon } from '../icons/ChatIcon.tsx';
import { RepostIcon } from '../icons/RepostIcon.tsx';
import { EllipsisIcon } from '../icons/EllipsisIcon.tsx';
import { useBookCatalog } from '../../lib/hooks/useBookCatalog.ts';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { lang, isRTL } = useI18n();
    const { data: book } = useBookCatalog(post.bookTagId);

    const timeAgo = (dateString: string) => {
        // Simple time ago logic
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
                        <Button variant="ghost" className="!text-slate-500 dark:!text-white/60 hover:!text-sky-400 !px-2">
                            <ChatIcon className="h-5 w-5 mr-2" /> <span className="text-sm">{post.stats.comments}</span>
                        </Button>
                        <Button variant="ghost" className="!text-slate-500 dark:!text-white/60 hover:!text-green-400 !px-2">
                            <RepostIcon className="h-5 w-5 mr-2" /> <span className="text-sm">{post.stats.reposts}</span>
                        </Button>
                        <Button variant="ghost" className="!text-slate-500 dark:!text-white/60 hover:!text-pink-400 !px-2">
                            <LikeIcon className="h-5 w-5 mr-2" /> <span className="text-sm">{post.stats.likes}</span>
                        </Button>
                         <Button variant="icon" className="!text-slate-500 dark:!text-white/60 hover:!text-accent">
                            <EllipsisIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default PostCard;