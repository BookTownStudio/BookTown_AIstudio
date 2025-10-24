import React, { useState, useRef, useEffect } from 'react';
import { Shelf } from '../../types/entities.ts';
import BilingualText from '../ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { ChevronDownIcon } from '../icons/ChevronDownIcon.tsx';
import { VerticalEllipsisIcon } from '../icons/VerticalEllipsisIcon.tsx';
import Button from '../ui/Button.tsx';
import ShelfContextMenu from './ShelfContextMenu.tsx';

interface ShelfHeaderProps {
    shelf: Shelf;
    bookCount: number;
    coverUrl?: string;
    isOpen: boolean;
    onToggle: () => void;
    onAddBookRequest: () => void;
    onEditRequest: () => void;
    onShareRequest: () => void;
    onDeleteRequest: () => void;
    onToggleLayout: () => void;
    isDeletable: boolean;
    isLoading: boolean;
}

const DEFAULT_COVER_URL = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3';

const ShelfHeader: React.FC<ShelfHeaderProps> = (props) => {
    const { 
        shelf, 
        bookCount, 
        coverUrl, 
        isOpen, 
        onToggle,
        onAddBookRequest,
        onEditRequest,
        onShareRequest,
        onDeleteRequest,
        onToggleLayout,
        isDeletable,
        isLoading
    } = props;
    const { lang, isRTL } = useI18n();
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

    const finalCoverUrl = bookCount > 0 ? (coverUrl || DEFAULT_COVER_URL) : DEFAULT_COVER_URL;

    return (
        <header className="flex items-center justify-between group">
            <button onClick={onToggle} className="flex-grow flex items-center gap-4 text-left py-2 group" aria-expanded={isOpen}>
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                    <img src={finalCoverUrl} alt="Shelf cover" className="w-full h-full object-cover" />
                </div>
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
             <div ref={menuRef} className="relative flex-shrink-0 ml-2">
                <Button variant="icon" onClick={() => setMenuOpen(!isMenuOpen)}>
                    <VerticalEllipsisIcon className="h-6 w-6" />
                </Button>
                {isMenuOpen && (
                    <ShelfContextMenu 
                        onAddBook={onAddBookRequest}
                        onEdit={onEditRequest}
                        onShare={onShareRequest}
                        onDelete={onDeleteRequest}
                        onToggleLayout={onToggleLayout}
                        onClose={() => setMenuOpen(false)}
                        isRTL={isRTL}
                        isDeletable={isDeletable}
                    />
                )}
            </div>
        </header>
    );
};

export default ShelfHeader;