

import React, { useState, useRef, useCallback, useEffect } from 'react';
import AppNav from '../../components/navigation/AppNav.tsx';
import Fab from '../../components/ui/Fab.tsx';
import { PlusIcon } from '../../components/icons/PlusIcon.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useSocialFeeds } from '../../lib/hooks/useSocialFeeds.ts';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import PostCard from '../../components/content/PostCard.tsx';
import { useNavigation } from '../../store/navigation.tsx';
import Button from '../../components/ui/Button.tsx';
import { useSocialSearch } from '../../lib/hooks/useSocialSearch.ts';
import UserSearchResultCard from '../../components/content/UserSearchResultCard.tsx';
import TopicSearchResultCard from '../../components/content/TopicSearchResultCard.tsx';
import { UsersIcon } from '../../components/icons/UsersIcon.tsx';

type SearchTab = 'posts' | 'users' | 'topics';

const PeopleFlowButton: React.FC = () => {
    const { navigate, currentView } = useNavigation();
    const { lang } = useI18n();

    const handlePress = () => {
        navigate({ type: 'immersive', id: 'peopleFlow', params: { from: currentView } });
    };

    return (
        <div
            className="fixed bottom-[98px] left-0 right-0 z-20 flex justify-center pointer-events-none"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <button
                onClick={handlePress}
                className="
                    flex items-center gap-2 px-6 py-3
                    bg-gray-100/80 dark:bg-slate-800/80 backdrop-blur-md 
                    shadow-xl shadow-primary/10 dark:shadow-black/40 
                    border border-black/5 dark:border-white/10 
                    text-slate-800 dark:text-white 
                    pointer-events-auto 
                    transition-all duration-300 ease-in-out
                    hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20
                    active:scale-100
                    rounded-full"
                aria-label={lang === 'en' ? 'Discover People' : 'اكتشف أشخاص'}
            >
                <UsersIcon className="h-5 w-5 text-accent" />
                <BilingualText className="font-bold text-lg">
                    {lang === 'en' ? 'People Flow' : 'اكتشف أشخاص'}
                </BilingualText>
            </button>
        </div>
    );
};


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

    const [isSocialSearching, setIsSocialSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearchTab, setActiveSearchTab] = useState<SearchTab>('posts');

    const { data: searchResults, isLoading: isSearching } = useSocialSearch(searchQuery);

    // Tab Reset Effect
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (resetTokens.social > 0) {
                handleExitSearch();
                mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    const handleExitSearch = () => {
        setSearchQuery('');
        setIsSocialSearching(false);
    };

    const SEARCH_TABS: { id: SearchTab; en: string; ar: string; }[] = [
        { id: 'posts', en: 'Posts', ar: 'المنشورات' },
        { id: 'users', en: 'Users', ar: 'المستخدمون' },
        { id: 'topics', en: 'Topics', ar: 'المواضيع' },
    ];

    const renderSearchResults = () => (
        <div>
            <div className="flex items-center border-b border-black/10 dark:border-white/10 -mx-4 px-4">
                {SEARCH_TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveSearchTab(tab.id)} className={`flex-1 py-3 text-center font-semibold border-b-2 transition-colors ${activeSearchTab === tab.id ? 'text-accent border-accent' : 'text-slate-500 dark:text-white/60 border-transparent hover:text-slate-900 dark:hover:text-white'}`}>
                        {lang === 'en' ? tab.en : tab.ar}
                    </button>
                ))}
            </div>
            <div className="mt-4 -mx-4">
                {isSearching && <div className="flex justify-center py-8"><LoadingSpinner /></div>}
                
                {!isSearching && activeSearchTab === 'posts' && (
                    <div className="space-y-4">
                        {searchResults?.posts.map(post => <PostCard key={post.id} post={post} />)}
                    </div>
                )}
                {!isSearching && activeSearchTab === 'users' && (
                    <div>
                        {searchResults?.users.map(user => <UserSearchResultCard key={user.uid} user={user} />)}
                    </div>
                )}
                 {!isSearching && activeSearchTab === 'topics' && (
                    <div>
                        {searchResults?.topics.map(topic => <TopicSearchResultCard key={topic} topic={topic} />)}
                    </div>
                )}

                {!isSearching && searchQuery && (!searchResults || (activeSearchTab === 'posts' && searchResults.posts.length === 0) || (activeSearchTab === 'users' && searchResults.users.length === 0) || (activeSearchTab === 'topics' && searchResults.topics.length === 0)) && (
                    <BilingualText className="text-center py-16 text-slate-500">No results found.</BilingualText>
                )}
            </div>
        </div>
    );

    const renderFeedContent = () => {
        if (isLoading) {
            return <div className="flex-grow flex items-center justify-center pt-16"><LoadingSpinner /></div>;
        }

        if (isError) {
            return <div className="flex-grow flex items-center justify-center pt-16"><BilingualText>Error loading feed.</BilingualText></div>;
        }
        
        if (posts.length === 0) {
             return <div className="flex-grow flex items-center justify-center pt-16"><BilingualText>The feed is empty.</BilingualText></div>;
        }

        return (
            <div className="space-y-4">
                {posts.map((post, index) => {
                    if (posts.length === index + 1) {
                        return <div ref={lastPostElementRef} key={post.id}><PostCard post={post} /></div>;
                    }
                    return <PostCard key={post.id} post={post} />;
                })}
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <AppNav titleEn="Social" titleAr="التواصل" />
            <main ref={mainContentRef} className="flex-grow overflow-y-auto pt-20 pb-28">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="py-4">
                         <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                placeholder={lang === 'en' ? 'Search Posts, Users, or Themes...' : 'ابحث في المنشورات، المستخدمين، أو المواضيع...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSocialSearching(true)}
                                className="w-full bg-slate-200 dark:bg-slate-800 rounded-lg py-2 pl-4 pr-10 text-slate-900 dark:text-white/90 placeholder:text-slate-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                            {isSocialSearching && (
                                <Button variant="ghost" onClick={handleExitSearch} className="!text-accent">
                                    {lang === 'en' ? 'Cancel' : 'إلغاء'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {isSocialSearching ? renderSearchResults() : (
                        <>
                            {renderFeedContent()}
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
                        </>
                    )}
                </div>
            </main>
            <PeopleFlowButton />
            <Fab onClick={handleNewPost} aria-label={lang === 'en' ? 'New Post' : 'منشور جديد'}>
                <PlusIcon className="h-8 w-8" />
            </Fab>
        </div>
    );
};

export default SocialScreen;