import React from 'react';
import GlassCard from '../ui/GlassCard.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import Button from '../ui/Button.tsx';
import { useI18n } from '../../store/i18n.tsx';
// FIX: Add file extension to entities.ts import
import { RecommendedShelf } from '../../types/entities.ts';
import { useFollowShelf } from '../../lib/hooks/useFollowShelf.ts';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { CheckIcon } from '../icons/CheckIcon.tsx';

interface RecommendedShelfCardProps {
    shelf: RecommendedShelf;
}

const RecommendedShelfCard: React.FC<RecommendedShelfCardProps> = ({ shelf }) => {
    const { lang } = useI18n();
    // In a real app, you'd check if the shelf is already followed
    const [isFollowed, setIsFollowed] = React.useState(false); 
    const { mutate: followShelf, isLoading: isFollowing } = useFollowShelf();

    const handleFollow = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        if (!isFollowed) {
            followShelf(shelf.id, {
                onSuccess: () => {
                    setIsFollowed(true);
                }
            });
        }
    };

    const handleCardClick = () => {
        // Navigate to a shelf detail view (future feature)
        console.log(`Navigating to details for shelf: ${shelf.id}`);
    };

    return (
        <div onClick={handleCardClick} className="w-72 flex-shrink-0 cursor-pointer group">
            <GlassCard className="!p-4 h-full flex flex-col justify-between transition-colors duration-300 group-hover:bg-black/5 dark:group-hover:bg-white/10">
                <div>
                    <BilingualText className="font-bold line-clamp-1">
                        {lang === 'en' ? shelf.titleEn : shelf.titleAr}
                    </BilingualText>
                    <BilingualText role="Caption">
                        {shelf.ownerName}
                    </BilingualText>
                </div>
                
                <div className="my-3 flex items-center -space-x-3">
                    {shelf.bookCovers.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`cover ${index + 1}`}
                            className="w-10 h-14 rounded object-cover border-2 border-slate-800 dark:border-slate-900 shadow-lg"
                        />
                    ))}
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                    <BilingualText role="Caption">
                        {shelf.followerCount.toLocaleString()} {lang === 'en' ? 'followers' : 'متابع'}
                    </BilingualText>
                    <Button 
                        variant="primary" 
                        className={`!px-3 !py-1 !text-sm ${isFollowed ? '!bg-green-500 hover:!bg-green-500/80' : ''}`}
                        onClick={handleFollow}
                        disabled={isFollowing || isFollowed}
                    >
                        {isFollowed ? (
                            <>
                                <CheckIcon className="h-4 w-4 mr-1" />
                                {lang === 'en' ? 'Following' : 'تمت المتابعة'}
                            </>
                        ) : (
                            <>
                                <PlusIcon className="h-4 w-4 mr-1" />
                                {lang === 'en' ? 'Follow' : 'متابعة'}
                            </>
                        )}
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
};

export default RecommendedShelfCard;
