import React from 'react';
import { useNavigation } from '../../store/navigation.tsx';
import { useBookCatalog } from '../../lib/hooks/useBookCatalog.ts';
import BilingualText from '../ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
import BookFlowActions from './BookFlowActions.tsx';
import LoadingSpinner from '../ui/LoadingSpinner.tsx';
import { mockQuoteOfTheDay } from '../../data/mocks.ts'; // For a fallback quote

interface BookFlowPageProps {
    bookId: string;
}

const BookFlowPage: React.FC<BookFlowPageProps> = ({ bookId }) => {
    const { data: book, isLoading } = useBookCatalog(bookId);
    const { navigate, currentView } = useNavigation();
    const { lang } = useI18n();

    const handleNavigateToDetails = () => {
        navigate({ type: 'immersive', id: 'bookDetails', params: { bookId, from: currentView } });
    };

    if (isLoading || !book) {
        return (
            <div className="h-screen w-screen flex-shrink-0 flex items-center justify-center bg-slate-800 scroll-snap-align-start">
                <LoadingSpinner />
            </div>
        );
    }

    // For simplicity, using a mock quote. A real app would fetch a quote for the book.
    const quote = mockQuoteOfTheDay;

    return (
        <div className="relative h-screen w-screen flex-shrink-0 scroll-snap-align-start">
            {/* Background Image */}
            <img src={book.coverUrl} alt="Book Cover" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
            
            {/* Clickable Area for Navigation */}
            <div
                className="absolute inset-0 z-0"
                onClick={handleNavigateToDetails}
                aria-label={`View details for ${lang === 'en' ? book.titleEn : book.titleAr}`}
            />

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col h-full justify-center items-center p-8 text-center text-white">
                <BilingualText role="Quote" className="!text-3xl !text-white !border-white/50 drop-shadow-lg">
                    {lang === 'en' ? quote.textEn : quote.textAr}
                </BilingualText>
                <BilingualText role="Caption" className="mt-4 text-white/80 drop-shadow-md">
                    — {lang === 'en' ? book.authorEn : book.authorAr}
                </BilingualText>
            </div>
            
            {/* Actions */}
            <BookFlowActions bookId={bookId} quoteId={quote.id} />
        </div>
    );
};
// Add scroll snap align style
const style = document.createElement('style');
style.innerHTML = `
.scroll-snap-align-start {
    scroll-snap-align: start;
}
`;
document.head.appendChild(style);


export default BookFlowPage;