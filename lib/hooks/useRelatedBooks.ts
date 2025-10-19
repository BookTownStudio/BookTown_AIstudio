

import { useQuery } from '../react-query.ts';
// FIX: Add file extension to entities.ts import
import { Book } from '../../types/entities.ts';
// FIX: Add file extension to mocks.ts import
import { mockBooks } from '../../data/mocks.ts';

const getRelatedBooks = async (currentBook: Book | undefined): Promise<string[]> => {
    if (!currentBook) {
        return [];
    }
    
    // Simulate network delay for a realistic loading experience
    await new Promise(res => setTimeout(res, 300));

    // FIX: Cast the result of Object.values to Book[] to resolve type errors
    const allBooks = Object.values(mockBooks) as Book[];
    
    const related = allBooks.filter(book => {
        // Exclude the current book itself from the related list
        if (book.id === currentBook.id) {
            return false;
        }
        // Find books that share at least one genre (using English genres for simplicity)
        const hasCommonGenre = book.genresEn.some(genre => currentBook.genresEn.includes(genre));
        return hasCommonGenre;
    });

    // Return up to 5 related book IDs
    return related.slice(0, 5).map(book => book.id);
};

export const useRelatedBooks = (currentBook: Book | undefined) => {
    return useQuery<string[]>({
        queryKey: ['relatedBooks', currentBook?.id],
        queryFn: () => getRelatedBooks(currentBook),
        enabled: !!currentBook, // Only run the query if the book object is available
    });
};
