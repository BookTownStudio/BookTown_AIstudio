import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppNav from '../../components/navigation/AppNav.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
import QuoteSnippetCard from '../../components/content/QuoteSnippetCard.tsx';
// FIX: Add file extension to mocks.ts import
import { mockQuoteOfTheDay } from '../../data/mocks.ts';
import { useUserShelves } from '../../lib/hooks/useUserShelves.ts';
import ShelfCarousel from '../../components/content/ShelfCarousel.tsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import { useQuickRecs } from '../../lib/hooks/useQuickRecs.ts';
import BookCard from '../../components/content/BookCard.tsx';
import { useAuth } from '../../lib/auth.tsx';
import { useUserProfile } from '../../lib/hooks/useUserProfile.ts';
import { useNavigation } from '../../store/navigation.tsx';
import { useLiveBookSearch } from '../../lib/hooks/useLiveBookSearch.ts';
import { useDiscoveryFeeds } from '../../lib/hooks/useDiscoveryFeeds.ts';
import CollapsibleSection from '../../components/ui/CollapsibleSection.tsx';
import { XCircleIcon } from '../../components/icons/XCircleIcon.tsx';
import { CameraIcon } from '../../components/icons/CameraIcon.tsx';
import { MicIcon } from '../../components/icons/MicIcon.tsx';
import { BookIcon } from '../../components/icons/BookIcon.tsx';
import { SurpriseIcon } from '../../components/icons/SurpriseIcon.tsx';
// FIX: Add AddBookModal import to support onAddBookRequest prop for ShelfCarousel.
import AddBookModal from '../../components/modals/AddBookModal.tsx';
import { Shelf } from '../../types/entities.ts';


const useCollapsibleState = (keys: string[], storageKey: string) => {
    const initialState = keys.reduce((acc, key) => ({ ...acc, [key]: true }), {});

    const [openSections, setOpenSections] = useState(() => {
        try {
            const item = window.localStorage.getItem(storageKey);
            return item ? { ...initialState, ...JSON.parse(item) } : initialState;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return initialState;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(openSections));
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
    }, [openSections, storageKey]);

    const toggleSection = (key: string) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return { openSections, toggleSection };
};

const QuickRecsCarousel: React.FC = () => {
    const { lang } = useI18n();
    const { bookIds, isLoading, isFallback } = useQuickRecs();
    const { navigate, currentView } = useNavigation();

    const handleBookClick = (bookId: string) => {
        navigate({ type: 'immersive', id: 'bookDetails', params: { bookId, from: currentView } });
    };

    const handleSurpriseMe = () => {
        navigate({ type: 'immersive', id: 'bookDetails', params: { bookId: 'surprise', from: currentView } });
    };
    
    const SurpriseMeCard = (
        <div className="flex-shrink-0 w-32 mr-4">
            <button
                onClick={handleSurpriseMe}
                className="group relative w-full aspect-[2/3] rounded-card bg-primary text-white p-3 flex flex-col items-center justify-center text-center shadow-lg shadow-black/30 hover:bg-opacity-80 transition-all duration-300 overflow-hidden"
                aria-label={lang === 'en' ? 'Surprise me with a book' : 'فاجئني بكتاب'}
            >
                {/* Twinkles */}
                <div className="absolute top-[20%] left-[15%] text-accent text-xl animate-twinkle-fade group-hover:opacity-0 transition-opacity duration-300" style={{ animationDelay: '0s' }}>
                    ✨
                </div>
                <div className="absolute top-[30%] right-[20%] text-accent text-base animate-twinkle-fade group-hover:opacity-0 transition-opacity duration-300" style={{ animationDelay: '0.5s' }}>
                    ✦
                </div>
                <div className="absolute bottom-[25%] left-[25%] text-accent text-lg animate-twinkle-fade group-hover:opacity-0 transition-opacity duration-300" style={{ animationDelay: '1s' }}>
                    ✧
                </div>

                {/* Main Icon */}
                <div className="relative z-10">
                    <SurpriseIcon className="w-8 h-8 mb-2 animate-pulse-subtle group-hover:animate-none transition-transform duration-300 group-hover:scale-125" />
                </div>
                <BilingualText className="font-bold text-sm leading-tight !text-white relative z-10">
                    {lang === 'en' ? 'Surprise me with a book' : 'فاجئني بكتاب'}
                </BilingualText>
                <BilingualText role="Caption" className="!text-xs !text-white/80 mt-1 relative z-10">
                    {lang === 'en' ? 'Get a random AI-powered recommendation' : 'احصل على توصية عشوائية'}
                </BilingualText>
            </button>
        </div>
    );

    const renderBookCard = (bookId: string) => (
        <div key={bookId} onClick={() => handleBookClick(bookId)} className="cursor-pointer">
            <BookCard 
                bookId={bookId}
                layout="list"
            />
        </div>
    );

    return (
        <section>
            {isFallback && (
                <BilingualText role="Caption" className="text-accent mb-2">
                    {lang === 'en' ? 'Showing top picks' : 'عرض أفضل الاختيارات'}
                </BilingualText>
            )}
           
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {isLoading && (
                    <>
                        <BookCard bookId="" layout="list" />
                        <div className="flex-shrink-0 w-32 mr-4">
                            <div className="w-full aspect-[2/3] rounded-card bg-primary/50 animate-pulse" />
                        </div>
                        <BookCard bookId="" layout="list" />
                        <BookCard bookId="" layout="list" />
                    </>
                )}
                {!isLoading && bookIds && bookIds.length > 0 && (
                    <>
                        {renderBookCard(bookIds[0])}
                        
                        {SurpriseMeCard}

                        {bookIds.slice(1).map(bookId => renderBookCard(bookId))}
                    </>
                )}
                 {!isLoading && (!bookIds || bookIds.length === 0) && (
                    SurpriseMeCard
                )}
            </div>
        </section>
    );
};

const TrendingCarousel: React.FC = () => {
    const { data: books, isLoading } = useDiscoveryFeeds();
    const { navigate, currentView } = useNavigation();

    const handleBookClick = (bookId: string) => {
        navigate({ type: 'immersive', id: 'bookDetails', params: { bookId, from: currentView } });
    };

    return (
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {isLoading && Array.from({ length: 2 }).map((_, i) => (
                <BookCard key={i} bookId="" layout="list" />
            ))}
            {books?.map(book => (
                <div key={book.id} onClick={() => handleBookClick(book.id)} className="cursor-pointer">
                    <BookCard 
                        bookId={book.id}
                        layout="list"
                    />
                </div>
            ))}
        </div>
    );
};


const HomeScreen: React.FC = () => {
    const { lang } = useI18n();
    const { user } = useAuth();
    const { navigate, currentView, resetTokens } = useNavigation();
    const { data: profile } = useUserProfile(user?.uid);
    const { data: shelves, isLoading: isLoadingShelves } = useUserShelves();

    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showOnlyEbooks, setShowOnlyEbooks] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const { data: searchResults, isLoading: isSearchingBooks } = useLiveBookSearch(searchQuery, showOnlyEbooks);
    
    const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

    const { openSections, toggleSection } = useCollapsibleState(
        ['recs', 'trending', 'reading', 'quote'],
        'booktown-collapsible-home'
    );
    
    // For tab reset logic
    const isInitialMount = useRef(true);
    
    // FIX: Add state and handlers for AddBookModal to satisfy ShelfCarousel props.
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [targetShelfId, setTargetShelfId] = useState<string | null>(null);

    const handleOpenAddBookModal = (shelfId: string) => {
        setTargetShelfId(shelfId);
        setAddModalOpen(true);
    };
    
    const handleCloseAddBookModal = () => {
        setTargetShelfId(null);
        setAddModalOpen(false);
    };

    const handleShareRequest = (shelf: Shelf) => {
        navigate({
            type: 'immersive',
            id: 'postComposer',
            params: { from: currentView, attachment: { type: 'shelf', id: shelf.id, ownerId: shelf.ownerId } }
        });
    };

    useEffect(() => {
        if (profile?.lastActive) {
            const lastActiveDate = new Date(profile.lastActive);
            const now = new Date();
            const hoursSinceLastActive = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60);
            if (hoursSinceLastActive >= 24 && hoursSinceLastActive <= 72) {
                setShowWelcomeBanner(true);
            }
        }
    }, [profile]);
    
    // Tab Reset Effect
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            // A non-zero token indicates a reset has been triggered.
            if (resetTokens.home > 0) {
                exitSearch();
            }
        }
    }, [resetTokens.home]);

    const handleInteraction = useCallback(() => {
        if (showWelcomeBanner) {
            setShowWelcomeBanner(false);
        }
    }, [showWelcomeBanner]);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    
    const handleSearchFocus = () => {
        setIsSearching(true);
        handleInteraction();
    };
    
    const exitSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
        setShowOnlyEbooks(false);
        searchInputRef.current?.blur();
    };
    
    const handleClearOrExit = () => {
        exitSearch();
    };

    const handleVoiceSearch = () => {
        if (isListening) return;

        console.log("Mock voice search initiated.");
        setIsListening(true);

        // Simulate voice input
        setTimeout(() => {
            setSearchQuery("mystery novels with a dark setting");
            setIsSearching(true);
            searchInputRef.current?.focus();
            setIsListening(false);
        }, 800);
    };

    const handleImageSearch = () => {
        console.log("Mock image search initiated.");
        // Simulate image scan returning a result
        setTimeout(() => {
            setSearchQuery("The ISBN is 9780743273565");
            setIsSearching(true);
            searchInputRef.current?.focus();
        }, 800);
    };

    const handleBookClick = (bookId: string) => {
        navigate({ type: 'immersive', id: 'bookDetails', params: { bookId, from: currentView } });
    };

    const currentlyReadingShelf = shelves?.find(s => s.id === 'currently-reading');
    
    const renderSearchResults = () => (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setShowOnlyEbooks(!showOnlyEbooks)} 
                    className={`flex items-center px-4 py-2 text-sm rounded-full transition-colors ${showOnlyEbooks ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white/80'}`}
                >
                    <BookIcon className="h-5 w-5 mr-2" />
                    {lang === 'en' ? 'Only eBooks' : 'الكتب الإلكترونية فقط'}
                </button>
            </div>

            {searchQuery && (
                <BilingualText role="H1" className="!text-xl pt-2">
                    {lang === 'en' ? `Search Results for "${searchQuery}"` : `نتائج البحث عن "${searchQuery}"`}
                </BilingualText>
            )}

            {isSearchingBooks && <div className="flex justify-center pt-8"><LoadingSpinner /></div>}
            
            {!isSearchingBooks && searchResults && searchResults.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {searchResults.map(book => (
                         <div key={book.id} onClick={() => handleBookClick(book.id)} className="cursor-pointer">
                            <BookCard bookId={book.id} layout="grid" />
                        </div>
                    ))}
                </div>
            )}

            {!isSearchingBooks && (!searchResults || searchResults.length === 0) && searchQuery && (
                <div className="text-center py-16 text-slate-500 dark:text-white/60">
                    <BilingualText>{lang === 'en' ? `No results for "${searchQuery}"` : `لا توجد نتائج لـ "${searchQuery}"`}</BilingualText>
                </div>
            )}
        </div>
    );

    const renderHomeFeeds = () => (
        <div 
            className="space-y-2"
            onScroll={handleInteraction}
            onMouseDown={handleInteraction}
            onTouchStart={handleInteraction}
        >
             <CollapsibleSection titleEn="Recommended For You" titleAr="موصى به لك" isOpen={openSections.recs} onToggle={() => toggleSection('recs')}>
                <QuickRecsCarousel />
            </CollapsibleSection>

            <CollapsibleSection titleEn="Trending & New Releases" titleAr="الرائج والإصدارات الجديدة" isOpen={openSections.trending} onToggle={() => toggleSection('trending')}>
                <TrendingCarousel />
            </CollapsibleSection>
            
            {isLoadingShelves ? (
                 <div className="flex justify-center py-4"><LoadingSpinner /></div>
            ) : (
                currentlyReadingShelf && currentlyReadingShelf.entries && Object.keys(currentlyReadingShelf.entries).length > 0 && (
                    <CollapsibleSection titleEn="Continue Reading" titleAr="متابعة القراءة" isOpen={openSections.reading} onToggle={() => toggleSection('reading')}>
                        {/* FIX: Pass missing required props to ShelfCarousel. */}
                        <ShelfCarousel
                            shelf={currentlyReadingShelf}
                            onAddBookRequest={handleOpenAddBookModal}
                            isOpen={true}
                            onToggle={() => {}}
                            onShareRequest={handleShareRequest}
                            onToggleLayout={() => {}}
                            layout="carousel"
                            isDeletable={false}
                        />
                    </CollapsibleSection>
                )
            )}
            
            <CollapsibleSection titleEn="Quote of the Day" titleAr="اقتباس اليوم" isOpen={openSections.quote} onToggle={() => toggleSection('quote')}>
                <QuoteSnippetCard quote={mockQuoteOfTheDay} />
            </CollapsibleSection>
        </div>
    );
    
    return (
        <div className="h-screen flex flex-col">
            <AppNav titleEn="BookTown" titleAr="بوكتاون" />

            <main className="flex-grow overflow-y-auto pt-20 pb-20">
                <div className="container mx-auto px-4 md:px-8 py-4 space-y-2">
                    <div className="bg-gray-50 dark:bg-slate-900 -mx-4 px-4">
                        <div className="relative flex-grow">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder={lang === 'en' ? 'Seek a Book...' : 'ابحث عن كتاب...'}
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                onFocus={handleSearchFocus}
                                className="w-full bg-slate-200 dark:bg-slate-800 rounded-2xl py-2 pl-4 pr-32 text-slate-900 dark:text-white/90 placeholder:text-slate-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {isSearching && (
                                    <button onClick={handleClearOrExit} className="p-1 text-slate-500 dark:text-white/60 hover:text-accent transition-colors" aria-label={lang === 'en' ? 'Clear or exit search' : 'مسح أو الخروج من البحث'}>
                                        <XCircleIcon className="h-6 w-6" />
                                    </button>
                                )}
                                <div className="w-px h-6 bg-slate-400 dark:bg-slate-600"></div>
                                <button
                                    onClick={handleVoiceSearch}
                                    aria-label={lang === 'en' ? 'Search by voice' : 'البحث بالصوت'}
                                    className="p-1 text-slate-500 dark:text-white/60 hover:text-accent transition-colors disabled:opacity-50"
                                    disabled={isListening}
                                >
                                    <MicIcon className={`h-6 w-6 transition-colors ${isListening ? 'text-accent animate-pulse' : ''}`} />
                                </button>
                                <button onClick={handleImageSearch} aria-label={lang === 'en' ? 'Search by image' : 'البحث بالصورة'} className="p-1 text-slate-500 dark:text-white/60 hover:text-accent transition-colors">
                                    <CameraIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {!isSearching && (
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showWelcomeBanner ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}>
                            {showWelcomeBanner && (
                                <BilingualText role="Body" className="!text-lg">
                                    {lang === 'en' ? 'Welcome back, ' : 'مرحبًا بعودتك، '}
                                    <span className="text-accent font-semibold">{profile?.name}</span>
                                </BilingualText>
                            )}
                        </div>
                    )}

                    {isSearching ? renderSearchResults() : renderHomeFeeds()}
                </div>
            </main>
            <AddBookModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddBookModal}
                targetShelfId={targetShelfId}
            />
        </div>
    );
};

export default HomeScreen;