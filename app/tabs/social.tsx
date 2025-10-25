import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useI18n } from '../../store/i18n.tsx';
import { useSocialFeeds } from '../../lib/hooks/useSocialFeeds.ts';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import PostCard from '../../components/content/PostCard.tsx';
import { useNavigation } from '../../store/navigation.tsx';
import DiscussionModal from '../../components/content/DiscussionModal.tsx';

const SocialScreen: React.FC = () => {
    const { lang } = useI18n();
    const { 
        data, 
        isLoading, 
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useSocialFeeds();
    
    const { navigate, currentView, resetTokens } = useNavigation();
    const mainContentRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);
    const [discussionPostId, setDiscussionPostId] = useState<string | null>(null);

    // Tab Reset Effect
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (resetTokens.social > 0) {
                mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                setDiscussionPostId(null);
            }
        }
    }, [resetTokens.social]);

    // Intersection Observer for infinite scroll
    const observer = useRef<IntersectionObserver | null>(null);
    const lastPostElementRef = useCallback(node => {
        if (isLoading || isFetchingNextPage) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage({});
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

    const posts = data?.pages.flatMap(page => page.posts) ?? [];
    
    const handleNewPost = () => {
        navigate({ type: 'immersive', id: 'postComposer', params: { from: currentView } });
    };

    const renderFeedContent = () => {
        if (isLoading) {
            return <div className="h-screen w-full flex items-center justify-center bg-slate-900"><LoadingSpinner /></div>;
        }

        if (isError) {
            return <div className="h-screen w-full flex items-center justify-center bg-slate-900"><BilingualText>Error loading feed.</BilingualText></div>;
        }
        
        if (posts.length === 0) {
             return <div className="h-screen w-full flex items-center justify-center bg-slate-900"><BilingualText>The feed is empty.</BilingualText></div>;
        }

        return (
            <>
                {posts.map((post, index) => {
                    const isLastElement = posts.length === index + 1;
                    return (
                        <div ref={isLastElement ? lastPostElementRef : null} key={post.id} className="h-screen w-full flex-shrink-0 snap-start">
                            <PostCard 
                                post={post} 
                                viewMode="flow" 
                                onOpenDiscussion={() => setDiscussionPostId(post.id)}
                                onNewPost={handleNewPost}
                            />
                        </div>
                    );
                })}
            </>
        );
    }

    return (
        <>
            <div 
                ref={mainContentRef} 
                className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            >
                {renderFeedContent()}
                {isFetchingNextPage && (
                    <div className="h-screen w-full flex-shrink-0 snap-start flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                )}
            </div>
            
            {discussionPostId && (
                <DiscussionModal 
                    postId={discussionPostId} 
                    onClose={() => setDiscussionPostId(null)} 
                />
            )}

            <style>{`
                .snap-y { scroll-snap-type: y; }
                .snap-mandatory { scroll-snap-stop: always; scroll-snap-type: y mandatory; }
                .snap-start { scroll-snap-align: start; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </>
    );
};

export default SocialScreen;