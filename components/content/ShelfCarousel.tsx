
import React from 'react';
// FIX: Add file extensions to imports
import BilingualText from '../ui/BilingualText.tsx';
import BookCard from './BookCard.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { Shelf } from '../../types/entities.ts';
import { useShelfEntries } from '../../lib/hooks/useUserShelves.ts';
import { useNavigation } from '../../store/navigation.tsx';

interface ShelfCarouselProps {
    shelf: Shelf;
}

const ShelfCarousel: React.FC<ShelfCarouselProps> = ({ shelf }) => {
    const { lang } = useI18n();
    const { data: entries, isLoading } = useShelfEntries(shelf.id);
    const { navigate, currentView } = useNavigation();

    const handleBookClick = (bookId: string) => {
        navigate({ type: 'immersive', id: 'bookDetails', params: { bookId, from: currentView } });
    };

    return (
        <section>
            <BilingualText role="H1" className="!text-xl mb-4">
                {lang === 'en' ? shelf.titleEn : shelf.titleAr}
            </BilingualText>
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {isLoading && Array.from({ length: 3 }).map((_, i) => (
                    <BookCard key={i} bookId="" layout="list" />
                ))}
                {entries?.map(entry => (
                    <div key={entry.bookId} onClick={() => handleBookClick(entry.bookId)} className="cursor-pointer">
                        <BookCard 
                            bookId={entry.bookId}
                            layout="list"
                            progress={shelf.id === 'currently-reading' ? entry.progress : undefined}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

// A utility to hide scrollbars, add this to your global CSS or a style tag if needed.
const style = document.createElement('style');
style.innerHTML = `
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
`;
document.head.appendChild(style);

export default ShelfCarousel;