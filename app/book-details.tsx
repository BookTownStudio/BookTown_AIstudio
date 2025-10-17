
import React, { useState, useMemo } from 'react';
// FIX: Added file extensions to imports
import { useNavigation } from '../../store/navigation.tsx';
import { useI18n } from '../../store/i18n.tsx';
import Button from '../../components/ui/Button.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon.tsx';
import { useBookCatalog } from '../../lib/hooks/useBookCatalog.ts';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import { useUserShelves, useShelfEntries } from '../../lib/hooks/useUserShelves.ts';
import { useToggleBookOnShelf } from '../../lib/hooks/useToggleBookOnShelf.ts';
import Chip from '../../components/ui/Chip.tsx';
import { StarIcon } from '../../components/icons/StarIcon.tsx';
import { BookPlusIcon } from '../../components/icons/BookPlusIcon.tsx';
import { CheckIcon } from '../../components/icons/CheckIcon.tsx';
import { useRelatedBooks } from '../../lib/hooks/useRelatedBooks.ts';
import BookCard from '../../components/content/BookCard.tsx';
import { useBookReviews } from '../../lib/hooks/useBookReviews.ts';
import { useSubmitReview } from '../../lib/hooks/useSubmitReview.ts';
import StarRatingInput from '../../components/ui/StarRatingInput.tsx';
import ReviewCard from '../../components/content/ReviewCard.tsx';
import { mockBooks } from '../../data/mocks.ts';

const BookDetailsScreen: React.FC = () => {
    const { currentView, navigate } = useNavigation();
    const { lang, isRTL } = useI18n();

    const originalBookId = currentView.type === 'immersive' ? currentView.params?.bookId : undefined;

    // Memoize the random book ID selection to prevent it from changing on re-renders
    const randomBookId = useMemo(() => {
        if (originalBookId !== 'surprise') return null;
        const bookKeys = Object.keys(mockBooks);
        if (bookKeys.length === 0) return null;
        return bookKeys[Math.floor(Math.random() * bookKeys.length)];
    }, [originalBookId]);
    
    const bookId = originalBookId === 'surprise' ? randomBookId : originalBookId;

    const { data: book, isLoading: isLoadingBook } = useBookCatalog(bookId);

    const { data: shelves } = useUserShelves();
    const wantToReadShelf = shelves?.find(s => s.id === 'want-to-read');
    const { data: wantToReadEntries } = useShelfEntries(wantToReadShelf?.id);
    const isOnWantToRead = wantToReadEntries?.some(e => e.bookId === bookId);

    const { mutate: toggleBook, isLoading: isToggling } = useToggleBookOnShelf();
    const { data: relatedBookIds, isLoading: isLoadingRelated } = useRelatedBooks(book);
    const { data: reviews, isLoading: isLoadingReviews } = useBookReviews(bookId);
    const { mutate: submitReview, isLoading: isSubmittingReview } = useSubmitReview();
    
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');


    const handleBack = () => {
        if (currentView.params?.from) {
            navigate(currentView.params.from);
        } else {
            // Sensible fallback
            navigate({ type: 'tab', id: 'home' });
        }
    };
    
    const handleToggleWantToRead = () => {
        if (bookId && wantToReadShelf) {
            toggleBook({ shelfId: wantToReadShelf.id, bookId });
        }
    };

    const handleRead = () => {
        navigate({ type: 'immersive', id: 'reader', params: { bookId, from: currentView } });
    };

    const handleReadSample = () => {
        navigate({ type: 'immersive', id: 'reader', params: { bookId, from: currentView, isSample: true } });
    };

    const handleReviewSubmit = () => {
        if (rating === 0 || !bookId) return;
        submitReview({ bookId, rating, text: reviewText }, {
            onSuccess: () => {
                setRating(0);
                setReviewText('');
            }
        });
    };

    const getReviewFormTitle = () => {
        if (isLoadingReviews) {
            return lang === 'en' ? 'Write a Review' : 'اكتب مراجعة';
        }
        if (reviews && reviews.length > 0) {
            return lang === 'en' ? 'Add Your Review' : 'أضف مراجعتك';
        }
        return lang === 'en' ? 'Be the first to review!' : 'كن أول من يراجع!';
    };

    if (isLoadingBook) {
        return <div className="h-screen w-full flex items-center justify-center bg-slate-900"><LoadingSpinner /></div>;
    }

    if (!book) {
        return (
            <div className="h-screen w-full flex flex-col bg-slate-900">
                <header className="fixed top-0 left-0 right-0 z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
                    <div className="container mx-auto flex h-20 items-center px-4">
                        <Button variant="ghost" onClick={handleBack}><ChevronLeftIcon className="h-6 w-6" /></Button>
                    </div>
                </header>
                 <div className="flex-grow flex items-center justify-center">
                    <BilingualText>Book not found.</BilingualText>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-full flex flex-col bg-slate-900">
            <header className="fixed top-0 left-0 right-0 z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
                <div className={`container mx-auto flex h-20 items-center justify-between px-4 md:px-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button variant="ghost" onClick={handleBack} aria-label={lang === 'en' ? 'Back' : 'رجوع'}>
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <BilingualText role="H1" className="!text-xl truncate absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[60vw]">
                         {lang === 'en' ? book.titleEn : book.titleAr}
                    </BilingualText>
                </div>
            </header>

            <main className="flex-grow pt-20 overflow-y-auto pb-10">
                <div className="container mx-auto p-4 md:p-8">
                    <div className={`md:flex md:gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                        <div className="flex-shrink-0 w-48 mx-auto md:mx-0">
                            <img src={book.coverUrl} alt="Book cover" className="w-full aspect-[2/3] rounded-card shadow-lg shadow-black/40" />
                        </div>
                        <div className="mt-6 md:mt-0 flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                            <div>
                                <BilingualText role="H1" className="!text-3xl">{lang === 'en' ? book.titleEn : book.titleAr}</BilingualText>
                                <BilingualText role="Body" className="text-white/80 mt-1 !text-lg">{lang === 'en' ? book.authorEn : book.authorAr}</BilingualText>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <StarIcon className="h-5 w-5 text-yellow-400" />
                                <BilingualText role="Body" className="font-bold">{book.rating.toFixed(1)}</BilingualText>
                                <BilingualText role="Caption">({book.ratingsCount.toLocaleString()})</BilingualText>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {(lang === 'en' ? book.genresEn : book.genresAr).map(g => <Chip key={g}>{g}</Chip>)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <BilingualText role="H1" className="!text-xl mb-2">{lang === 'en' ? 'Description' : 'الوصف'}</BilingualText>
                        <BilingualText role="Body" className="text-white/70">
                            {lang === 'en' ? book.descriptionEn : book.descriptionAr}
                        </BilingualText>
                    </div>

                    <div className="mt-8 space-y-4">
                        <Button variant="primary" className="w-full" onClick={handleRead}>
                            {lang === 'en' ? 'Start Reading' : 'ابدأ القراءة'}
                        </Button>
                        <div className="flex items-center gap-4">
                            {book.isEbookAvailable && (
                                <Button variant="ghost" className="flex-1" onClick={handleReadSample}>
                                    {lang === 'en' ? 'Read Sample' : 'قراءة عينة'}
                                </Button>
                            )}
                            <Button 
                                variant="ghost" 
                                className="flex-1" 
                                onClick={handleToggleWantToRead} 
                                disabled={isToggling}>
                                {isOnWantToRead ? <CheckIcon className="h-5 w-5 mr-2" /> : <BookPlusIcon className="h-5 w-5 mr-2" />}
                                {lang === 'en' ? 'Want to Read' : 'أرغب في قراءته'}
                            </Button>
                        </div>
                    </div>

                    <div className="mt-12">
                        <BilingualText role="H1" className="!text-xl mb-4">{lang === 'en' ? 'Reviews' : 'المراجعات'}</BilingualText>
                        
                        {isLoadingReviews && <div className="flex justify-center py-4"><LoadingSpinner/></div>}

                        {!isLoadingReviews && reviews && reviews.length > 0 && (
                            <div className="bg-slate-800/50 border border-white/10 rounded-card p-4 mb-6">
                                {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
                            </div>
                        )}

                        {/* Submission Form */}
                        <div className="bg-slate-800/50 border border-white/10 rounded-card p-4">
                            <BilingualText role="Body" className="font-semibold mb-3">
                                {getReviewFormTitle()}
                            </BilingualText>
                            <div className="flex items-center justify-between">
                                <StarRatingInput rating={rating} onRatingChange={setRating} />
                                <BilingualText role="Caption">
                                    {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : (lang === 'en' ? 'Tap to rate' : 'انقر للتقييم')}
                                </BilingualText>
                            </div>
                            <div className="mt-4 flex items-center gap-4">
                                <input
                                    type="text"
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder={lang === 'en' ? 'Share your thoughts...' : 'شارك بأفكارك...'}
                                    className="flex-grow bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 h-[44px]"
                                />
                                <Button 
                                    variant="primary" 
                                    onClick={handleReviewSubmit}
                                    disabled={rating === 0 || isSubmittingReview}
                                    className="flex-shrink-0"
                                >
                                    {isSubmittingReview ? <LoadingSpinner /> : (lang === 'en' ? 'Submit' : 'إرسال')}
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-12">
                        <BilingualText role="H1" className="!text-xl mb-4">{lang === 'en' ? 'You Might Also Like' : 'قد يعجبك أيضاً'}</BilingualText>
                        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                            {isLoadingRelated && Array.from({ length: 3 }).map((_, i) => (
                                <BookCard key={i} bookId="" layout="list" />
                            ))}
                            {relatedBookIds?.map(bookId => (
                                <div key={bookId} onClick={() => navigate({ type: 'immersive', id: 'bookDetails', params: { bookId, from: currentView }})} className="cursor-pointer">
                                    <BookCard 
                                        bookId={bookId}
                                        layout="list"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default BookDetailsScreen;
