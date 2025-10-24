import React, { useState, useRef, useEffect } from 'react';
import BookCard from './BookCard.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { Shelf, ShelfEntry } from '../../types/entities.ts';
import { useShelfEntries } from '../../lib/hooks/useUserShelves.ts';
import { useNavigation } from '../../store/navigation.tsx';
import AddBookCard from './AddBookCard.tsx';
import ShelfHeader from './ShelfHeader.tsx';
import { useBookCatalog } from '../../lib/hooks/useBookCatalog.ts';
import AddBookRow from './AddBookRow.tsx';
import { useRemoveBookFromShelf } from '../../lib/hooks/useToggleBookOnShelf.ts';
import Button from '../ui/Button.tsx';
import { TrashIcon } from '../icons/TrashIcon.tsx';

interface ShelfCarouselProps {
    shelf: Shelf;
    onAddBookRequest: (shelfId: string) => void;
    onEditRequest: (shelf: Shelf) => void;
    onShareRequest: (shelf: Shelf) => void;
    onDeleteRequest: (shelf: Shelf) => void;
    isOpen: boolean;
    onToggle: () => void;
    onToggleLayout: () => void;
    layout: 'carousel' | 'list';
    isDeletable: boolean;
}

const ShelfCarousel: React.FC<ShelfCarouselProps> = ({ 
    shelf, 
    onAddBookRequest, 
    onEditRequest,
    onShareRequest,
    onDeleteRequest,
    isOpen, 
    onToggle, 
    onToggleLayout,
    layout,
    isDeletable 
}) => {
    const { lang } = useI18n();
    const { data: entries, isLoading } = useShelfEntries(shelf.id, shelf.ownerId);
    const { navigate, currentView } = useNavigation();
    const { mutate: removeBook, isLoading: isRemoving } = useRemoveBookFromShelf();

    const [orderedEntries, setOrderedEntries] = useState<ShelfEntry[]>([]);
    const draggedItemIndex = useRef<number | null>(null);

    const firstBookId = entries && entries.length > 0 ? entries[0].bookId : undefined;
    const { data: firstBook } = useBookCatalog(firstBookId);

    useEffect(() => {
        if (entries) {
            setOrderedEntries(entries);
        }
    }, [entries]);

    const handleBookClick = (bookId: string) => {
        navigate({ type: 'immersive', id: 'bookDetails', params: { bookId, from: currentView } });
    };

    const handleRemoveBook = (e: React.MouseEvent, bookId: string) => {
        e.stopPropagation(); // prevent navigation
        removeBook({ shelfId: shelf.id, bookId });
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        draggedItemIndex.current = index;
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            e.currentTarget.classList.add('dragging');
        }, 0);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        const draggedIndex = draggedItemIndex.current;
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newOrderedEntries = [...orderedEntries];
        const [draggedItem] = newOrderedEntries.splice(draggedIndex, 1);
        newOrderedEntries.splice(dropIndex, 0, draggedItem);
        
        setOrderedEntries(newOrderedEntries);
        console.log(`[Mock Save] New book order for shelf '${shelf.id}':`, newOrderedEntries.map(entry => entry.bookId));
    };
    
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('dragging');
        draggedItemIndex.current = null;
    };

    const renderBookList = () => {
        if (layout === 'carousel') {
             return (
                 <div className="flex overflow-x-auto pt-2 pb-2 -mx-4 px-4 scrollbar-hide">
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
                            className="transition-opacity cursor-pointer"
                        >
                            <BookCard 
                                bookId={entry.bookId}
                                layout="list"
                                progress={shelf.id === 'currently-reading' ? entry.progress : undefined}
                            />
                        </div>
                    ))}
                </div>
             );
        }
        
        return (
            <div className="space-y-2 pt-2 pb-2">
                <AddBookRow onClick={() => onAddBookRequest(shelf.id)} />
                {isLoading && Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 w-full bg-slate-700/50 animate-pulse rounded-lg" />
                ))}
                {orderedEntries?.map((entry, index) => (
                    <div key={entry.bookId} className="flex items-center gap-2 group">
                        <div 
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            onClick={() => handleBookClick(entry.bookId)} 
                            className="transition-opacity cursor-pointer flex-grow"
                        >
                            <BookCard 
                                bookId={entry.bookId}
                                layout="row"
                                progress={shelf.id === 'currently-reading' ? entry.progress : undefined}
                            />
                        </div>
                         <Button 
                            variant="icon"
                            onClick={(e) => handleRemoveBook(e, entry.bookId)}
                            disabled={isRemoving}
                            className="!text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                            aria-label={lang === 'en' ? 'Remove book' : 'إزالة الكتاب'}
                        >
                            <TrashIcon className="h-5 w-5" />
                        </Button>
                    </div>
                ))}
            </div>
        )
    };
    
    return (
        <section className="rounded-xl bg-white p-4 dark:bg-slate-800/40">
            <ShelfHeader
                shelf={shelf}
                bookCount={orderedEntries.length}
                coverUrl={shelf.userCoverUrl || firstBook?.coverUrl}
                isOpen={isOpen}
                onToggle={onToggle}
                onAddBookRequest={() => onAddBookRequest(shelf.id)}
                onEditRequest={() => onEditRequest(shelf)}
                onShareRequest={() => onShareRequest(shelf)}
                onDeleteRequest={() => onDeleteRequest(shelf)}
                onToggleLayout={onToggleLayout}
                isDeletable={isDeletable}
                isLoading={isLoading}
            />
            
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    {renderBookList()}
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