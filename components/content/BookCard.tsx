import React from 'react';
import { useI18n } from '../../store/i18n';
import BilingualText from '../ui/BilingualText';
import ProgressBar from '../ui/ProgressBar';
import { useBookCatalog } from '../../lib/hooks/useBookCatalog';
import { useNavigation } from '../../store/navigation.tsx';

interface BookCardProps {
  bookId: string;
  layout: 'grid' | 'list';
  progress?: number; // 0-100
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({ bookId, layout, progress, className = '' }) => {
    const { lang } = useI18n();
    const { data: book, isLoading, isError } = useBookCatalog(bookId);
    const { navigate, currentView } = useNavigation();

    const handleAuthorClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (book?.authorId) {
            navigate({ type: 'immersive', id: 'authorDetails', params: { authorId: book.authorId, from: currentView } });
        }
    };

    const Skeleton = () => (
        <div className={`flex-shrink-0 ${layout === 'list' ? 'w-32 mr-4' : 'w-full'} ${className}`}>
            <div className="aspect-[2/3] w-full rounded-card bg-white/5 animate-pulse"></div>
            <div className="mt-2 h-4 w-3/4 rounded bg-white/5 animate-pulse"></div>
            <div className="mt-1 h-3 w-1/2 rounded bg-white/5 animate-pulse"></div>
        </div>
    );

    if (isLoading) {
        return <Skeleton />;
    }

    if (isError || !book) {
        // Render a placeholder or error state
        return (
             <div className={`flex-shrink-0 ${layout === 'list' ? 'w-32 mr-4' : ''} ${className}`}>
                <div className="aspect-[2/3] w-full rounded-card bg-red-500/10 flex items-center justify-center">
                   <BilingualText role="Caption" className="!text-xs text-center p-2 text-red-300">
                     {lang === 'en' ? 'Error loading book' : 'خطأ في تحميل الكتاب'}
                   </BilingualText>
                </div>
            </div>
        );
    }

    const authorText = (
        <button onClick={handleAuthorClick} className="w-full text-left group">
            <BilingualText role="Caption" className="!text-xs mt-1 line-clamp-1 group-hover:text-accent transition-colors">
                {lang === 'en' ? book.authorEn : book.authorAr}
            </BilingualText>
        </button>
    );

    if (layout === 'grid') {
        return (
            <div className={`flex flex-col ${className}`}>
                <div className="aspect-[2/3] w-full rounded-card overflow-hidden shadow-lg shadow-black/30">
                    <img src={book.coverUrl} alt={lang === 'en' ? book.titleEn : book.titleAr} className="w-full h-full object-cover" />
                </div>
                <div className="mt-2">
                    <BilingualText className="font-bold text-sm leading-tight line-clamp-2">
                        {lang === 'en' ? book.titleEn : book.titleAr}
                    </BilingualText>
                    {authorText}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex-shrink-0 w-32 mr-4 ${className}`}>
             <div className="aspect-[2/3] w-full rounded-card overflow-hidden shadow-lg shadow-black/30">
                <img src={book.coverUrl} alt={lang === 'en' ? book.titleEn : book.titleAr} className="w-full h-full object-cover" />
            </div>
            {progress !== undefined && (
                <div className="mt-2">
                    <ProgressBar progress={progress} />
                </div>
            )}
            <div className={progress === undefined ? 'mt-2' : 'mt-1'}>
                <BilingualText className="font-bold text-xs leading-tight line-clamp-2">
                     {lang === 'en' ? book.titleEn : book.titleAr}
                </BilingualText>
                {authorText}
            </div>
        </div>
    );
};

export default BookCard;