import React, { useState, useRef } from 'react';
import { useNavigation } from '../../store/navigation.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useAuthorDetails } from '../../lib/hooks/useAuthorDetails.ts';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import Button from '../../components/ui/Button.tsx';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon.tsx';
import { mockBooks, mockUserQuotes } from '../../data/mocks.ts';
import BookCard from '../../components/content/BookCard.tsx';
import QuoteSnippetCard from '../../components/content/QuoteSnippetCard.tsx';
import { PlusIcon } from '../../components/icons/PlusIcon.tsx';
import { ShareIcon } from '../../components/icons/ShareIcon.tsx';
import { BookIcon } from '../../components/icons/BookIcon.tsx';
import { QuoteIcon } from '../../components/icons/QuoteIcon.tsx';
import { useFollowAuthor } from '../../lib/hooks/useFollowAuthor.ts';

const AuthorDetailsScreen: React.FC = () => {
    const { currentView, navigate } = useNavigation();
    const { lang, isRTL } = useI18n();
    const authorId = currentView.type === 'immersive' ? currentView.params?.authorId : undefined;

    const { data: author, isLoading, isError } = useAuthorDetails(authorId);
    const [isFollowed, setIsFollowed] = useState(false);
    const [isBioExpanded, setBioExpanded] = useState(false);
    const { mutate: followAuthor, isLoading: isFollowing } = useFollowAuthor();

    const booksSectionRef = useRef<HTMLElement>(null);

    const handleBack = () => {
        if (currentView.params?.from) {
            navigate(currentView.params.from);
        } else {
            navigate({ type: 'tab', id: 'home' });
        }
    };

    const handleBookClick = (bookId: string) => {
        navigate({ type: 'immersive', id: 'bookDetails', params: { bookId, from: currentView } });
    };

    const handleFollow = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (authorId && !isFollowed) {
            followAuthor(authorId, {
                onSuccess: () => setIsFollowed(true),
            });
        }
    };
    
    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (authorId) {
            navigate({ type: 'immersive', id: 'postComposer', params: { from: currentView, attachment: { type: 'author', id: authorId } } });
        }
    };

    const handleViewBooks = () => {
        if (!authorId) return;
        navigate({ type: 'drawer', id: 'books', params: { authorId, from: currentView } });
    };

    const handleViewQuotes = () => {
        if (!authorId) return;
        navigate({ type: 'drawer', id: 'quotes', params: { authorId, from: currentView } });
    };

    const booksByAuthor = authorId ? Object.values(mockBooks).filter(b => b.authorId === authorId) : [];
    const quotesByAuthor = authorId ? mockUserQuotes.filter(q => q.authorId === authorId) : [];

    const ActionButton: React.FC<{ icon: React.FC<any>, onClick: (e: React.MouseEvent) => void, label: string, disabled?: boolean }> = ({ icon: Icon, onClick, label, disabled = false }) => (
        <button 
            onClick={onClick} 
            aria-label={label} 
            disabled={disabled}
            className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-white/80 hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
        >
            <Icon className="h-7 w-7" />
        </button>
    );

    if (isLoading) {
        return <div className="h-screen w-full flex items-center justify-center bg-slate-900"><LoadingSpinner /></div>;
    }
    
    if (isError || !author) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900">
                <BilingualText>Author not found.</BilingualText>
                <Button onClick={handleBack} className="mt-4">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-900">
            <header className="fixed top-0 left-0 right-0 z-20 bg-transparent">
                <div className="container mx-auto flex h-20 items-center justify-start px-4">
                    <Button variant="icon" onClick={handleBack} className="bg-black/40 backdrop-blur-sm !text-white" aria-label={lang === 'en' ? 'Back' : 'رجوع'}>
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto pt-20 pb-10">
                <div className="container mx-auto px-4 md:px-8">
                    {/* Author Header */}
                    <div className={`flex flex-row gap-4 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <img src={author.avatarUrl} alt={lang === 'en' ? author.nameEn : author.nameAr} className="h-28 w-28 rounded-full flex-shrink-0 border-4 border-slate-700 shadow-lg" />
                        <div className="flex-grow">
                            <BilingualText role="H1" className="!text-3xl">
                                {lang === 'en' ? author.nameEn : author.nameAr}
                            </BilingualText>
                            <BilingualText role="Caption" className="mt-1">{author.lifespan}</BilingualText>
                            <BilingualText role="Caption">{lang === 'en' ? author.countryEn : author.countryAr}</BilingualText>
                            <BilingualText role="Caption">{lang === 'en' ? author.languageEn : author.languageAr}</BilingualText>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 grid grid-cols-4 gap-4">
                       <ActionButton icon={PlusIcon} onClick={handleFollow} label="Follow Author" disabled={isFollowing || isFollowed} />
                       <ActionButton icon={ShareIcon} onClick={handleShare} label="Share Author" />
                       <ActionButton icon={BookIcon} onClick={handleViewBooks} label="View Books" />
                       <ActionButton icon={QuoteIcon} onClick={handleViewQuotes} label="View Quotes" />
                    </div>

                    {/* Bio Section */}
                    <section className="mt-8">
                        <BilingualText role="H1" className="!text-2xl mb-2">{lang === 'en' ? 'Biography' : 'السيرة الذاتية'}</BilingualText>
                        <div className="relative">
                            <BilingualText role="Body" className={`text-white/70 transition-all duration-300 ${!isBioExpanded ? 'line-clamp-4' : ''}`}>
                                {lang === 'en' ? author.bioEn : author.bioAr}
                            </BilingualText>
                            {!isBioExpanded && (
                                <button 
                                    onClick={() => setBioExpanded(true)}
                                    className={`absolute bottom-0 bg-gradient-to-r from-transparent via-slate-900/80 to-slate-900 py-0.5 text-accent font-semibold ${isRTL ? 'left-0 bg-gradient-to-l pl-1 pr-8' : 'right-0 pl-8 pr-1'}`}
                                >
                                    {lang === 'en' ? 'more ...' : '... المزيد'}
                                </button>
                            )}
                        </div>
                    </section>
                    
                    {/* Books Section */}
                    <section ref={booksSectionRef} className="mt-8">
                        <BilingualText role="H1" className="!text-xl mb-4">
                            {lang === 'en' ? 'Books by this Author' : 'كتب هذا المؤلف'}
                        </BilingualText>
                        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                            {booksByAuthor.length > 0 ? (
                                booksByAuthor.map(book => (
                                    <div key={book.id} onClick={() => handleBookClick(book.id)} className="cursor-pointer">
                                        <BookCard bookId={book.id} layout="list" />
                                    </div>
                                ))
                            ) : (
                                <BilingualText role="Caption" className="text-white/60">No books found in catalog.</BilingualText>
                            )}
                        </div>
                    </section>

                    {/* Quotes Section */}
                    <section className="mt-8">
                        <BilingualText role="H1" className="!text-xl mb-4">
                            {lang === 'en' ? 'Featured Quote' : 'اقتباس مميز'}
                        </BilingualText>
                        {quotesByAuthor.length > 0 ? (
                            <QuoteSnippetCard quote={quotesByAuthor[0]} />
                        ) : (
                            <BilingualText role="Caption" className="text-white/60">No quotes found.</BilingualText>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AuthorDetailsScreen;