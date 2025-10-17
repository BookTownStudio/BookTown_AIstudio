

import React, { useState } from 'react';
import { useNavigation } from '../../store/navigation';
import { useI18n } from '../../store/i18n';
import { useLiveBookSearch } from '../../lib/hooks/useLiveBookSearch';
import Button from '../../components/ui/Button';
import BilingualText from '../../components/ui/BilingualText';
import BookCard from '../../components/content/BookCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon';
import { MicIcon } from '../../components/icons/MicIcon';
import { CameraIcon } from '../../components/icons/CameraIcon';

const LiveSearchScreen: React.FC = () => {
    const { navigate, currentView } = useNavigation();
    const { lang, isRTL } = useI18n();
    const [query, setQuery] = useState('');

    // FIX: The useLiveBookSearch hook expects a second argument, `showOnlyEbooks`. Passing `false` as a default since there's no UI for it on this screen.
    const { data: results, isLoading } = useLiveBookSearch(query, false);

    const handleBack = () => {
        if (currentView.params?.from) {
            navigate(currentView.params.from);
        } else {
            navigate({ type: 'tab', id: 'home' });
        }
    };

    const handleBookClick = (bookId: string) => {
        navigate({ type: 'immersive', id: 'bookDetails', params: { bookId, from: currentView } });
    }

    const renderResults = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                </div>
            );
        }

        if (!query) {
             return (
                <div className="text-center py-16">
                    <BilingualText role="Body" className="text-slate-500 dark:text-white/60">
                        {lang === 'en' ? 'Start typing to search for books.' : 'ابدأ الكتابة للبحث عن الكتب.'}
                    </BilingualText>
                </div>
            );
        }

        if (results && results.length > 0) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.map(book => (
                        <div key={book.id} onClick={() => handleBookClick(book.id)}>
                            <BookCard bookId={book.id} layout="grid" />
                        </div>
                    ))}
                </div>
            );
        }
        
        if (!isLoading && query) {
            return (
                <div className="text-center py-16">
                    <BilingualText role="Body" className="text-slate-500 dark:text-white/60">
                        {lang === 'en' ? `No results found for "${query}"` : `لم يتم العثور على نتائج لـ "${query}"`}
                    </BilingualText>
                </div>
            );
        }
        
        return null;
    };

    return (
        <div className="h-screen w-full flex flex-col bg-gray-50 dark:bg-slate-900">
            <header className="sticky top-0 z-10 bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-black/10 dark:border-white/10">
                <div className="container mx-auto flex h-20 items-center gap-2 px-4 md:px-8">
                    <Button variant="ghost" onClick={handleBack} aria-label={lang === 'en' ? 'Back' : 'رجوع'}>
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder={lang === 'en' ? 'Seek a Book...' : 'ابحث عن كتاب...'}
                            dir={isRTL ? 'rtl' : 'ltr'}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                            className="w-full bg-slate-200 dark:bg-slate-800 rounded-full py-3 pl-4 pr-24 text-slate-900 dark:text-white/90 placeholder:text-slate-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                            <Button variant="icon"><MicIcon className="h-6 w-6" /></Button>
                            <Button variant="icon"><CameraIcon className="h-6 w-6" /></Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow overflow-y-auto">
                <div className="container mx-auto p-4 md:p-8">
                    {renderResults()}
                </div>
            </main>
        </div>
    );
};

export default LiveSearchScreen;