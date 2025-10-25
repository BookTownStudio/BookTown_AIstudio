import React from 'react';
import { useNavigation } from '../../store/navigation.tsx';
import { usePostDetails } from '../../lib/hooks/usePostDetails.ts';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import PostCard from '../../components/content/PostCard.tsx';
import CommentThread from '../../components/content/CommentThread.tsx';
import ScreenHeader from '../../components/navigation/ScreenHeader.tsx';

const PostDetailsScreen: React.FC = () => {
    const { currentView, navigate } = useNavigation();
    const postId = currentView.type === 'immersive' ? currentView.params?.postId : undefined;
    const { data: post, isLoading } = usePostDetails(postId);

    const handleBack = () => {
        if (currentView.params?.from) {
            navigate(currentView.params.from);
        } else {
            navigate({ type: 'tab', id: 'social' });
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <ScreenHeader titleEn="Post" titleAr="منشور" onBack={handleBack} />
            <main className="flex-grow overflow-y-auto pt-20">
                <div className="container mx-auto p-4">
                    {isLoading && <div className="flex justify-center py-16"><LoadingSpinner /></div>}
                    {post && (
                        <>
                            <PostCard post={post} viewMode="list" />
                            <div className="my-4 border-t border-black/10 dark:border-white/10" />
                            <CommentThread post={post} />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PostDetailsScreen;