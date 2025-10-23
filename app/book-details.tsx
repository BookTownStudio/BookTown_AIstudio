import React, { useState, useMemo } from 'react';
// FIX: Added file extensions to imports
import { useNavigation } from '../../store/navigation.tsx';
import { useI18n } from '../../store/i18n.tsx';
import Button from '../../components/ui/Button.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { useBookCatalog } from '../../lib/hooks/useBookCatalog.ts';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import { StarIcon } from '../../components/icons/StarIcon.tsx';
import { useRelatedBooks } from '../../lib/hooks/useRelatedBooks.ts';
import BookCard from '../../components/content/BookCard.tsx';
import { useBookReviews } from '../../lib/hooks/useBookReviews.ts';
import { useSubmitReview } from '../../lib/hooks/useSubmitReview.ts';
import StarRatingInput from '../../components/ui/StarRatingInput.tsx';
import ReviewCard from '../../components/content/ReviewCard.tsx';
// FIX: Add file extension to mocks.ts import
import { mockBooks, mockBookDetails, mockBookDetailsReviews } from '../../data/mocks.ts';
import { XIcon } from '../../components/icons/XIcon.tsx';
import { PlusIcon } from '../../components/icons/PlusIcon.tsx';
import { UploadIcon } from '../../components/icons/UploadIcon.tsx';
import { EyeIcon } from '../../components/icons/EyeIcon.tsx';
import { QuoteIcon } from '../../components/icons/QuoteIcon.tsx';
import SelectShelfModal from '../../components/modals/SelectShelfModal.tsx';

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

    const { data: book, isLoading: isLoadingBook, isError: isErrorBook } = useBookCatalog(bookId);
    const { data: relatedBookIds, isLoading: isLoadingRelated } = useRelatedBooks(book);
    const { data: reviews, isLoading: isLoadingReviews } = useBookReviews(bookId);
    const { mutate: submitReview, isLoading: isSubmittingReview } = useSubmitReview();
    
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isShelfModalOpen, setShelfModalOpen] = useState(false);
    const [isSummaryExpanded, setSummaryExpanded] = useState(false);
    
    // --- Fallback Logic ---
    const displayBook = !isErrorBook && book ? book : mockBookDetails;
    const displayReviews = reviews && reviews.length > 0 ? reviews : mockBookDetailsReviews;

    const handleBack = () => {
        if (currentView.params?.from) {
            navigate(currentView.params.from);
        } else {
            navigate({ type: 'tab', id: 'home' });
        }
    };

    const handleRead = () => {
        navigate({ type: 'immersive', id: 'reader', params: { bookId, from: currentView } });
    };
    
    const handleAuthorClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (displayBook?.authorId) {
            navigate({ type: 'immersive', id: 'authorDetails', params: { authorId: displayBook.authorId, from: currentView } });
        }
    };

    const handleBuy = () => {
        alert('This eBook is not available in our library. You can find it at your favorite online or local bookstore!');
    };
    
    const handleViewQuotes = () => {
        if (!bookId || bookId === 'surprise' || bookId === 'mock-celestial-labyrinth') return;
        navigate({ type: 'drawer', id: 'quotes', params: { bookId, from: currentView } });
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

    const handleShare = () => {
        if (!bookId) return;
        navigate({ 
            type: 'immersive', 
            id: 'postComposer', 
            params: { from: currentView, attachment: { type: 'book', id: bookId } } 
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

    const ActionButton: React.FC<{ icon: React.FC<any>, onClick: (e: React.MouseEvent) => void, label: string }> = ({ icon: Icon, onClick, label }) => (
        <button 
            onClick={onClick} 
            aria-label={label} 
            className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-white/80 hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        >
            <Icon className="h-7 w-7" />
        </button>
    );

    if (isLoadingBook) {
        return <div className="h-screen w-full flex items-center justify-center bg-slate-900"><LoadingSpinner /></div>;
    }

    return (
        <>
            <div className="h-screen w-full flex flex-col bg-slate-900">
                <header className="fixed top-0 left-0 right-0 z-20 bg-transparent">
                    <div className="container mx-auto flex h-20 items-center justify-start px-4">
                        <Button variant="icon" onClick={handleBack} className="bg-black/40 backdrop-blur-sm !text-white" aria-label={lang === 'en' ? 'Close' : 'إغلاق'}>
                            <XIcon className="h-6 w-6" />
                        </Button>
                    </div>
                </header>

                <main className="flex-grow overflow-y-auto pb-10">
                    <div className="container mx-auto p-4 md:p-8 pt-20">
                        <div className={`flex flex-row gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="flex-shrink-0 w-32 sm:w-40">
                                <img src={displayBook.coverUrl} alt="Book cover" className="w-full aspect-[2/3] rounded-lg shadow-lg shadow-black/40" />
                            </div>
                            <div className="flex-grow flex flex-col items-start text-left">
                                <BilingualText role="H1" className="!text-2xl sm:!text-3xl">{lang === 'en' ? displayBook.titleEn : displayBook.titleAr}</BilingualText>
                                <button onClick={handleAuthorClick} className="text-left group">
                                    <BilingualText role="Body" className="text-white/80 mt-1 !text-base sm:!text-lg group-hover:text-accent transition-colors">{lang === 'en' ? displayBook.authorEn : displayBook.authorAr}</BilingualText>
                                </button>
                                <BilingualText role="Caption" className="mt-2">
                                    {displayBook.publicationDate?.split('-')[0]} · {displayBook.pageCount} {lang === 'en' ? 'pages' : 'صفحة'}
                                </BilingualText>
                                <div className="flex items-center justify-start gap-2 mt-2">
                                    <StarIcon className="h-5 w-5 text-yellow-400" />
                                    <BilingualText role="Body" className="font-bold">{displayBook.rating.toFixed(1)}</BilingualText>
                                    <BilingualText role="Caption">({displayBook.ratingsCount.toLocaleString()} {lang === 'en' ? 'ratings' : 'تقييمًا'})</BilingualText>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-4 gap-4">
                           <ActionButton icon={PlusIcon} onClick={(e) => { e.stopPropagation(); setShelfModalOpen(true); }} label="Add to shelf" />
                           <ActionButton icon={UploadIcon} onClick={handleShare} label="Share" />
                           <ActionButton icon={EyeIcon} onClick={displayBook.isEbookAvailable ? handleRead : handleBuy} label="Read or Buy" />
                           <ActionButton icon={QuoteIcon} onClick={handleViewQuotes} label="View Quotes" />
                        </div>

                        <div className="mt-8">
                            <BilingualText role="H1" className="!text-2xl mb-2">{lang === 'en' ? 'Summary' : 'ملخص'}</BilingualText>
                            <div className="relative">
                                <BilingualText role="Body" className={`text-white/70 transition-all duration-300 ${!isSummaryExpanded ? 'line-clamp-3' : ''}`}>
                                    {lang === 'en' ? displayBook.descriptionEn : displayBook.descriptionAr}
                                </BilingualText>
                                {!isSummaryExpanded && (
                                    <button 
                                        onClick={() => setSummaryExpanded(true)}
                                        className={`absolute bottom-0 bg-gradient-to-r from-transparent via-slate-900/80 to-slate-900 py-0.5 text-accent font-semibold ${isRTL ? 'left-0 bg-gradient-to-l pl-1 pr-8' : 'right-0 pl-8 pr-1'}`}
                                    >
                                        {lang === 'en' ? 'more ...' : '... المزيد'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-12">
                            <BilingualText role="H1" className="!text-2xl mb-4">{lang === 'en' ? 'Reviews' : 'المراجعات'}</BilingualText>
                            
                            {/* Submission Form */}
                            <div className="bg-slate-800/50 border border-white/10 rounded-card p-4 mb-6">
                                <BilingualText role="Body" className="font-semibold mb-3">
                                    {getReviewFormTitle()}
                                </BilingualText>
                                <div className="flex items-center justify-center mb-4">
                                    <StarRatingInput rating={rating} onRatingChange={setRating} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder={lang === 'en' ? 'Add your review' : 'أضف مراجعتك'}
                                        className="flex-grow bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 h-[44px] resize-none"
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
                            
                            {isLoadingReviews && <div className="flex justify-center py-4"><LoadingSpinner/></div>}

                            {!isLoadingReviews && displayReviews && displayReviews.length > 0 && (
                                <div className="space-y-2">
                                    {displayReviews.map(review => <ReviewCard key={review.id} review={review} />)}
                                </div>
                            )}

                        </div>
                    </div>
                </main>
            </div>
            {bookId && <SelectShelfModal isOpen={isShelfModalOpen} onClose={() => setShelfModalOpen(false)} bookId={bookId} />}
        </>
    );
};

export default BookDetailsScreen;