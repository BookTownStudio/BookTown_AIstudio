

import React, { useState, useRef, useCallback, useEffect } from 'react';
import AppNav from '../../components/navigation/AppNav';
import Fab from '../../components/ui/Fab';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { useI18n } from '../../store/i18n';
import { useSocialFeeds } from '../../lib/hooks/useSocialFeeds';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import BilingualText from '../../components/ui/BilingualText';
import PostCard from '../../components/content/PostCard';
import PostComposer from '../../components/modals/PostComposer';
import { useNavigation } from '../../store/navigation';

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
    
    const [isComposerOpen, setComposerOpen] = useState(false);
    const { resetTokens } = useNavigation();
    const mainContentRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    // Tab Reset Effect
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (resetTokens.social > 0) {
                mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [resetTokens.social]);

    // Intersection Observer for infinite scroll
    const observer = useRef<IntersectionObserver>();
    const lastPostElementRef = useCallback(node => {
        if (isLoading || isFetchingNextPage) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                // FIX: The mock `fetchNextPage` function from `useInfiniteQuery` was called without arguments, but it expects one. Passing an empty object to trigger fetching the next page.
                fetchNextPage({});
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);


    const posts = data?.pages.flatMap(page => page.posts) ?? [];

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex-grow flex items-center justify-center"><LoadingSpinner /></div>;
        }

        if (isError) {
            return <div className="flex-grow flex items-center justify-center"><BilingualText>Error loading feed.</BilingualText></div>;
        }
        
        if (posts.length === 0) {
             return <div className="flex-grow flex items-center justify-center"><BilingualText>The feed is empty.</BilingualText></div>;
        }

        return (
            <div className="space-y-4">
                {posts.map((post, index) => {
                    // Attach the ref to the last element
                    if (posts.length === index + 1) {
                        return <div ref={lastPostElementRef} key={post.id}><PostCard post={post} /></div>;
                    }
                    return <PostCard key={post.id} post={post} />;
                })}
            </div>
        );
    }

    return (
        <>
            <div className="h-screen flex flex-col">
                <AppNav titleEn="Social" titleAr="التواصل" />
                <main ref={mainContentRef} className="flex-grow overflow-y-auto pt-24 pb-28">
                    <div className="container mx-auto px-4 md:px-8">
                        {renderContent()}
                        {isFetchingNextPage && (
                            <div className="flex justify-center py-4">
                                <LoadingSpinner />
                            </div>
                        )}
                        {!hasNextPage && !isLoading && (
                             <div className="text-center py-6">
                                <BilingualText role="Caption">You've reached the end.</BilingualText>
                            </div>
                        )}
                    </div>
                </main>
                <Fab onClick={() => setComposerOpen(true)} aria-label={lang === 'en' ? 'New Post' : 'منشور جديد'}>
                    <PlusIcon className="h-8 w-8" />
                </Fab>
            </div>
            <PostComposer isOpen={isComposerOpen} onClose={() => setComposerOpen(false)} />
        </>
    );
};

export default SocialScreen;