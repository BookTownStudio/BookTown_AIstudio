

import { useQuery } from '../react-query.ts';
// FIX: Add file extension to entities.ts import
import { Book } from '../../types/entities.ts';
// FIX: Add file extension to mocks.ts import
import { mockBooks } from '../../data/mocks.ts';

const searchBooks = async (query: string, showOnlyEbooks: boolean): Promise<Book[]> => {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 250));

    if (!query) {
        return [];
    }

    const lowerCaseQuery = query.toLowerCase();
    // FIX: Cast the result of Object.values to Book[] to resolve type errors
    const allBooks = Object.values(mockBooks) as Book[];

    let results = allBooks.filter(book => 
        book.titleEn.toLowerCase().includes(lowerCaseQuery) ||
        book.titleAr.includes(lowerCaseQuery) || // Arabic is often searched without case sensitivity issues
        book.authorEn.toLowerCase().includes(lowerCaseQuery) ||
        book.authorAr.includes(lowerCaseQuery)
    );

    if (showOnlyEbooks) {
        results = results.filter(book => book.isEbookAvailable);
    }

    return results;
};


export const useLiveBookSearch = (query: string, showOnlyEbooks: boolean) => {
    // Debouncing is a good idea in a real app, but for this mock, direct call is fine.
    const debouncedQuery = query;

    return useQuery<Book[]>({
        queryKey: ['liveSearch', debouncedQuery, showOnlyEbooks],
        queryFn: () => searchBooks(debouncedQuery, showOnlyEbooks),
        enabled: true, // Always enabled, the function handles the empty query case
    });
};
