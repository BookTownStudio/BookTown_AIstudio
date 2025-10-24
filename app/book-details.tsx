
import React, { useState, useMemo, useRef, useEffect } from 'react';
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
import SelectShelfModal from '../../components/modals/SelectShelfModal.tsx';
import { useUserShelves } from '../../lib/hooks/useUserShelves.ts';
import { useRemoveBookFromShelf } from '../../lib/hooks/useToggleBookOnShelf.ts';
import { TrashIcon } from '../../components/icons/TrashIcon.tsx';
import { ShelvesIcon } from '../../components/icons/ShelvesIcon.tsx';
import { BasketIcon } from '../../components/icons/BasketIcon.tsx';
import PurchaseHubModal from '../../components/modals/PurchaseHubModal.tsx';
import { VerticalEllipsisIcon } from '../../components/icons/VerticalEllipsisIcon.tsx';
import GlassCard from '../../components/ui/GlassCard.tsx';
import { QuoteIcon } from '../../components/icons/QuoteIcon.tsx';

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
    const { data: shelves } = useUserShelves();
    const { mutate: removeBook, isLoading: isRemoving } = useRemoveBookFromShelf();
    
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isShelfModalOpen, setShelfModalOpen] = useState(false);
    const [isSummaryExpanded, setSummaryExpanded] = useState(false);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    const shelvesWithBook = useMemo(() => {
        if (!shelves || !bookId) return [];
        return shelves.filter(s => s.entries && Object.keys(s.entries).includes(bookId));
    }, [shelves, bookId]);
    
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
        setIsPurchaseModalOpen(true);
    };
    
    const handleViewQuotes = () => {
        setMenuOpen(false);
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

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMenuOpen(false);
        if (shelvesWithBook.length === 1 && bookId) {
            removeBook({ shelfId: shelvesWithBook[0].id, bookId });
        }
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

    const ActionButton: React.FC<{ icon: React.FC<any>, onClick: (e: React.MouseEvent) => void, label: string, disabled?: boolean }> = ({ icon: Icon, onClick, label, disabled = false }) => (
        <button 
            onClick={onClick} 
            aria-label={label}
            disabled={disabled}
            className="w-full h-14 bg-slate-800 rounded-full flex items-center justify-center text-white/80 hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
        >
            <Icon className="h-7 w-7" />
        </button>
    );
    
    const renderShelfActionButton = () => {
        if (shelvesWithBook.length > 0) {
            return (
                <ActionButton 
                    icon={ShelvesIcon} 
                    onClick={(e) => { e.stopPropagation(); setShelfModalOpen(true); }} 
                    label="Manage shelves"
                />
            );
        }
        return (
            <ActionButton 
                icon={PlusIcon} 
                onClick={(e) => { e.stopPropagation(); setShelfModalOpen(true); }} 
                label="Add to shelf"
            />
        );
    };

    if (isLoadingBook) {
        return <div className="h-screen w-full flex items-center justify-center bg-slate-900"><LoadingSpinner /></div>;
    }

    return (
        <>
            <div className="h-screen w-full flex flex-col bg-slate-900">
                <header className="fixed top-0 left-0 right-0 z-20 bg-transparent">
                    <div className="container mx-auto flex h-20 items-center justify-between px-4">
                        <Button variant="icon" onClick={handleBack} className="bg-black/40 backdrop-blur-sm !text-white" aria-label={lang === 'en' ? 'Close' : 'إغلاق'}>
                            <XIcon className="h-6 w-6" />
                        </Button>
                        <div ref={menuRef} className="relative">
                            <Button variant="icon" onClick={() => setMenuOpen(!isMenuOpen)} className="bg-black/40 backdrop-blur-sm !text-white" aria-label={lang === 'en' ? 'More options' : 'المزيد من الخيارات'}>
                                <VerticalEllipsisIcon className="h-6 w-6" />
                            </Button>
                            {isMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 z-30 w-56">
                                    <GlassCard className="!p-2">
                                        <ul className="space-y-1">
                                            {shelvesWithBook.length === 1 && (
                                                <li>
                                                    <Button variant="ghost" className="w-full !justify-start !text-inherit !font-normal !px-3 !text-red-400 hover:!bg-red-500/10" onClick={handleRemove} disabled={isRemoving}>
                                                        <TrashIcon className="h-5 w-5 mr-3" />
                                                        {lang === 'en' ? 'Remove from Shelf' : 'إزالة من الرف'}
                                                    </Button>
                                                </li>
                                            )}
                                        </ul>
                                    </GlassCard>
                                </div>
                            )}
                        </div>
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
                           {renderShelfActionButton()}
                           <ActionButton icon={QuoteIcon} onClick={handleViewQuotes} label="View Quotes" />
                           <ActionButton icon={UploadIcon} onClick={handleShare} label="Share" />
                           {displayBook.isEbookAvailable ? (
                               <ActionButton icon={EyeIcon} onClick={handleRead} label="Read" />
                           ) : (
                               <ActionButton icon={BasketIcon} onClick={handleBuy} label="Buy" />
                           )}
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
            <PurchaseHubModal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} book={displayBook} />
        </>
    );
};

export default BookDetailsScreen;
