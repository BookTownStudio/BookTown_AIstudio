import React from 'react';
import { Notification, SocialLikeNotification, SocialReplyNotification, SystemRecommendationNotification, ActivityShelfAddNotification } from '../../types/entities.ts';
import { useI18n } from '../../store/i18n.tsx';
import { useNavigation } from '../../store/navigation.tsx';
import { useUserProfile } from '../../lib/hooks/useUserProfile.ts';
import { usePostDetails } from '../../lib/hooks/usePostDetails.ts';
import BilingualText from '../ui/BilingualText.tsx';
import { LikeIcon } from '../icons/LikeIcon.tsx';
import { ChatIcon } from '../icons/ChatIcon.tsx';
import { LightbulbIcon } from '../icons/LightbulbIcon.tsx';
import { ShelvesIcon } from '../icons/ShelvesIcon.tsx';
import { cn } from '../../lib/utils.ts';

const timeAgo = (dateString: string, lang: 'en' | 'ar') => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + (lang === 'en' ? "d" : "ي");
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + (lang === 'en' ? "h" : "س");
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + (lang === 'en' ? "m" : "د");
    return lang === 'en' ? 'Just now' : 'الآن';
};

const NotificationCard: React.FC<{ notification: Notification }> = ({ notification }) => {
    const { lang } = useI18n();
    const { navigate, currentView } = useNavigation();
    const { data: actor } = useUserProfile(notification.actorId);
    
    // Specific data for rendering content snippets
    const { data: post } = usePostDetails(
        (notification.type === 'social_like' || notification.type === 'social_reply') ? notification.postId : undefined
    );

    const handlePress = () => {
        switch (notification.type) {
            case 'social_like':
            case 'social_reply':
                navigate({ type: 'immersive', id: 'postDetails', params: { postId: notification.postId, from: currentView } });
                break;
            case 'system_recommendation':
                navigate({ type: 'tab', id: 'home' });
                break;
            case 'activity_shelf_add':
                // Assuming we have a quote details screen to navigate to
                navigate({ type: 'drawer', id: 'quotes', params: { from: currentView } });
                break;
            default:
                break;
        }
    };
    
    const renderContent = () => {
        switch (notification.type) {
            case 'social_like':
                return (
                    <BilingualText>
                        <span className="font-bold">{actor?.name || '...'}</span> liked your post: <span className="text-white/70 italic">"{post?.content.substring(0, 30)}..."</span>
                    </BilingualText>
                );
            case 'social_reply':
                return (
                    <BilingualText>
                        <span className="font-bold">{actor?.name || '...'}</span> replied to your post: <span className="text-white/70 italic">"{notification.commentSnippet.substring(0, 30)}..."</span>
                    </BilingualText>
                );
            case 'system_recommendation':
                 return <BilingualText>Librarian has new book recommendations for you.</BilingualText>;
            case 'activity_shelf_add':
                return (
                     <BilingualText>
                        <span className="font-bold">{actor?.name || '...'}</span> added your quote to a shelf.
                    </BilingualText>
                );
            default:
                return null;
        }
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'social_like': return <LikeIcon className="h-6 w-6 text-pink-400" />;
            case 'social_reply': return <ChatIcon className="h-6 w-6 text-sky-400" />;
            case 'system_recommendation': return <LightbulbIcon className="h-6 w-6 text-amber-400" />;
            case 'activity_shelf_add': return <ShelvesIcon className="h-6 w-6 text-green-400" />;
            default: return null;
        }
    };

    return (
        <button
            onClick={handlePress}
            className={cn(
                "w-full text-left p-4 flex items-start gap-4 transition-colors",
                notification.isRead ? 'hover:bg-slate-800' : 'bg-primary/10 hover:bg-primary/20'
            )}
        >
            {!notification.isRead && <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />}
            <div className={cn("flex-shrink-0 w-8 text-center", notification.isRead && "ml-4")}>{getIcon()}</div>
            <div className="flex-grow">
                {actor && <img src={actor.avatarUrl} alt={actor.name} className="h-8 w-8 rounded-full mb-2" />}
                <div className="text-sm">{renderContent()}</div>
                <BilingualText role="Caption" className="!text-xs mt-1">{timeAgo(notification.timestamp, lang)}</BilingualText>
            </div>
        </button>
    );
};

export default NotificationCard;