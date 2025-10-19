
import React, { useState, useRef, useEffect } from 'react';
import BilingualText from '../ui/BilingualText.tsx';
import BookCard from './BookCard.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { Shelf, ShelfEntry } from '../../types/entities.ts';
import { useShelfEntries } from '../../lib/hooks/useUserShelves.ts';
import { useNavigation } from '../../store/navigation.tsx';
import Button from '../ui/Button.tsx';
import ShelfContextMenu from './ShelfContextMenu.tsx';
import { ChevronDownIcon } from '../icons/ChevronDownIcon.tsx';
import { VerticalEllipsisIcon } from '../icons/VerticalEllipsisIcon.tsx';
import AddBookCard from './AddBookCard.tsx';

interface ShelfCarouselProps {
    shelf: Shelf;
    onAddBookRequest: (shelfId: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

const ShelfCarousel: React.FC<ShelfCarouselProps> = ({ shelf, onAddBookRequest, isOpen, onToggle }) => {
    const { lang, isRTL } = useI18n();
    const { data: entries, isLoading } = useShelfEntries(shelf.id);
    const { navigate, currentView } = useNavigation();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // State for drag and drop reordering
    const [orderedEntries, setOrderedEntries] = useState<ShelfEntry[]>([]);
    const draggedItemIndex = useRef<number | null>(null);

    // Sync local state when entries from hook change
    useEffect(() => {
        if (entries) {
            setOrderedEntries(entries);
        }
    }, [entries]);

    const handleBookClick = (bookId: string) => {
        navigate({ type: 'immersive', id: 'bookDetails', params: { bookId, from: currentView } });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        draggedItemIndex.current = index;
        e.dataTransfer.effectAllowed = 'move';
        // Add a small delay to allow the browser to render the drag image correctly
        setTimeout(() => {
            e.currentTarget.classList.add('dragging');
        }, 0);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // This is necessary to allow dropping
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        const draggedIndex = draggedItemIndex.current;
        if (draggedIndex === null || draggedIndex === dropIndex) {
            return;
        }

        const newOrderedEntries = [...orderedEntries];
        const [draggedItem] = newOrderedEntries.splice(draggedIndex, 1);
        newOrderedEntries.splice(dropIndex, 0, draggedItem);
        
        setOrderedEntries(newOrderedEntries);
        // In a real app, you would dispatch a mutation here to save the new order.
        console.log(`[Mock Save] New book order for shelf '${shelf.id}':`, newOrderedEntries.map(entry => entry.bookId));
    };
    
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('dragging');
        draggedItemIndex.current = null;
    };

    const bookCount = orderedEntries.length;

    return (
        <section>
            <header className="flex items-center justify-between">
                <button onClick={onToggle} className="flex-grow flex items-center justify-between text-left py-2 pr-2 group" aria-expanded={isOpen}>
                    <div className="flex-grow">
                        <BilingualText role="H1" className="!text-xl group-hover:text-accent transition-colors">
                            {lang === 'en' ? shelf.titleEn : shelf.titleAr}
                        </BilingualText>
                        {!isLoading && (
                            <BilingualText role="Caption">
                                {bookCount} {lang === 'en' ? (bookCount === 1 ? 'book' : 'books') : 'كتاب'}
                            </BilingualText>
                        )}
                    </div>
                    <ChevronDownIcon className={`h-6 w-6 text-slate-500 dark:text-white/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div ref={menuRef} className="relative flex-shrink-0">
                    <Button variant="icon" onClick={() => setMenuOpen(!isMenuOpen)}>
                        <VerticalEllipsisIcon className="h-6 w-6" />
                    </Button>
                    {isMenuOpen && (
                        <ShelfContextMenu 
                            onAddBook={() => onAddBookRequest(shelf.id)}
                            onClose={() => setMenuOpen(false)}
                            isRTL={isRTL}
                        />
                    )}
                </div>
            </header>
            
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                     <div className="flex overflow-x-auto pt-2 pb-4 -mx-4 px-4 scrollbar-hide">
                        <AddBookCard onClick={() => onAddBookRequest(shelf.id)} />
                        {isLoading && Array.from({ length: 3 }).map((_, i) => (
                            <BookCard key={i} bookId="" layout="list" />
                        ))}
                        {orderedEntries?.map((entry, index) => (
                            <div 
                                key={entry.bookId} 
                                draggable="true"
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                onClick={() => handleBookClick(entry.bookId)} 
                                className="transition-opacity"
                            >
                                <BookCard 
                                    bookId={entry.bookId}
                                    layout="list"
                                    progress={shelf.id === 'currently-reading' ? entry.progress : undefined}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// A utility to hide scrollbars and add DnD styles
const style = document.createElement('style');
style.innerHTML = `
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
[draggable="true"] {
    cursor: grab;
}
[draggable="true"]:active {
    cursor: grabbing;
}
.dragging {
    opacity: 0.4;
}
`;
document.head.appendChild(style);

export default ShelfCarousel;
