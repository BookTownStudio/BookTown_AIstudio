import React, { useState } from 'react';
import { Post } from '../../types/entities.ts';
import { useI18n } from '../../store/i18n.tsx';
import { LikeIcon } from '../icons/LikeIcon.tsx';
import { ChatIcon } from '../icons/ChatIcon.tsx';
import { RepostIcon } from '../icons/RepostIcon.tsx';
import { ShareIcon } from '../icons/ShareIcon.tsx';
import { BookmarkIcon } from '../icons/BookmarkIcon.tsx';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { cn } from '../../lib/utils.ts';

import useLongPress from '../../lib/hooks/useLongPress.ts';
import GlassCard from '../ui/GlassCard.tsx';
import Button from '../ui/Button.tsx';
import { LightbulbIcon } from '../icons/LightbulbIcon.tsx';
import { ClapIcon } from '../icons/ClapIcon.tsx';
import { LaughIcon } from '../icons/LaughIcon.tsx';
import { ThumbsDownIcon } from '../icons/ThumbsDownIcon.tsx';
import { ChevronRightIcon } from '../icons/ChevronRightIcon.tsx';

interface InteractionRailProps {
    post: Post;
    onOpenDiscussion: () => void;
    onNewPost?: () => void;
}

const ActionButton: React.FC<{ icon: React.FC<any>, label: string, count?: number, iconClassName?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ icon: Icon, label, count, iconClassName, ...props }) => (
    <button className="flex flex-col items-center gap-1 group" aria-label={label} {...props}>
        <div className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:bg-white/20">
            <Icon className={cn("h-5 w-5", iconClassName)} />
        </div>
        {count !== undefined && <span className="text-xs font-semibold text-white/90 drop-shadow-md">{count}</span>}
    </button>
);

const ReactionMenu: React.FC<{ onSelect: (reaction: string) => void }> = ({ onSelect }) => {
    const reactions = [
        { name: 'Insightful', icon: LightbulbIcon },
        { name: 'Appreciate', icon: ClapIcon },
        { name: 'Funny', icon: LaughIcon },
        { name: 'Dislike', icon: ThumbsDownIcon },
    ];
    return (
        <GlassCard className="absolute bottom-full mb-2 flex items-center gap-1 !p-1.5 -translate-x-1/2 left-1/2">
            {reactions.map(r => (
                <Button key={r.name} variant="icon" className="!w-10 !h-10" onClick={() => onSelect(r.name)}>
                    <r.icon className="h-6 w-6" />
                </Button>
            ))}
        </GlassCard>
    );
};


const InteractionRail: React.FC<InteractionRailProps> = ({ post, onOpenDiscussion, onNewPost }) => {
    const { lang } = useI18n();
    const [showReactionMenu, setShowReactionMenu] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleAction = (e: React.MouseEvent, action: string) => {
        e.stopPropagation();
        console.log(`[Mock Action] ${action} on post ${post.id}`);
    }

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleAction(e, 'Like');
    };
    
    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setShowReactionMenu(true);
    };

    const longPressEvents = useLongPress(handleLongPress, handleLike, { delay: 300 });

    const handleReactionSelect = (reaction: string) => {
        console.log(`[Mock Reaction] ${reaction} on post ${post.id}`);
        setShowReactionMenu(false);
    }
    
    const baseActionsProps = [
        { id: 'like', special: true, props: { icon: LikeIcon, label: lang === 'en' ? 'Like' : 'إعجاب', count: post.stats.likes, iconClassName: 'text-pink-400', ...longPressEvents } },
        { id: 'repost', props: { icon: RepostIcon, label: lang === 'en' ? 'Repost' : 'إعادة نشر', count: post.stats.reposts, iconClassName: 'text-green-400', onClick: (e: React.MouseEvent) => handleAction(e, 'Repost') } },
        { id: 'share', props: { icon: ShareIcon, label: lang === 'en' ? 'Share' : 'مشاركة', iconClassName: 'text-sky-400', onClick: (e: React.MouseEvent) => handleAction(e, 'Share') } },
        { id: 'bookmark', props: { icon: BookmarkIcon, label: lang === 'en' ? 'Bookmark' : 'حفظ', iconClassName: 'text-amber-400', onClick: (e: React.MouseEvent) => handleAction(e, 'Bookmark') } },
        { id: 'comment', props: { icon: ChatIcon, label: lang === 'en' ? 'Comment' : 'تعليق', count: post.stats.comments, iconClassName: 'text-blue-300', onClick: (e: React.MouseEvent) => { e.stopPropagation(); onOpenDiscussion(); } } }
    ];

    const allActionsProps = (onNewPost
        ? [{ id: 'new-post', props: { icon: PlusIcon, label: lang === 'en' ? 'New Post' : 'منشور جديد', onClick: (e: React.MouseEvent) => { e.stopPropagation(); onNewPost!(); } } }, ...baseActionsProps]
        : baseActionsProps).reverse();


    return (
        <div 
            className="absolute bottom-28 right-4 z-20 flex flex-col items-center" 
            style={{ paddingBottom: 'env(safe-area-inset-bottom)'}}
        >
            <div className="flex flex-col-reverse items-center gap-3">
                {allActionsProps.map((action, index) => {
                    const delay = index * 50;
                    const wrapperClasses = cn(
                        "transition-all duration-200 ease-out origin-bottom",
                        isExpanded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 scale-50 translate-y-6 pointer-events-none'
                    );

                    if (action.id === 'like') {
                        return (
                            <div
                                key={action.id}
                                className={wrapperClasses}
                                style={{ transitionDelay: `${delay}ms` }}
                            >
                                <div className="relative" onMouseLeave={() => setShowReactionMenu(false)}>
                                    <ActionButton {...action.props} />
                                    {showReactionMenu && <ReactionMenu onSelect={handleReactionSelect} />}
                                </div>
                            </div>
                        );
                    }
                    
                    return (
                        <div
                            key={action.id}
                            className={wrapperClasses}
                            style={{ transitionDelay: `${delay}ms` }}
                        >
                            <ActionButton {...action.props} />
                        </div>
                    );
                })}
            </div>

            <button 
                className="flex flex-col items-center gap-1 group mt-3"
                aria-label={isExpanded ? "Collapse actions" : "Expand actions"} 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }}
            >
                <div className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70 shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:bg-white/20">
                    <ChevronRightIcon className={cn("h-5 w-5 transition-transform duration-200", isExpanded ? 'rotate-90' : '-rotate-90')} />
                </div>
            </button>
        </div>
    );
};

export default InteractionRail;