import { useQuery } from '../react-query.ts';
import { Book } from '../../types/entities.ts';
import { MOCK_DATA } from '../../data/mocks.ts';

const getBooksByAuthor = async (authorId: string | undefined): Promise<Book[]> => {
    if (!authorId) return [];
    await new Promise(res => setTimeout(res, 200)); // Simulate delay
    
    const allBooks = Object.values(MOCK_DATA.catalog.books);
    return allBooks.filter(book => book.authorId === authorId);
};

export const useBooksByAuthor = (authorId: string | undefined) => {
    return useQuery<Book[]>({
        queryKey: ['booksByAuthor', authorId],
        queryFn: () => getBooksByAuthor(authorId),
        enabled: !!authorId,
    });
};