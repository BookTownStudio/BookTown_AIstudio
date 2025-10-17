
import { useQuery } from '../react-query.ts';
import { db } from '../firebase.ts';
import { Book } from '../../types/entities.ts';

// In a real app, this would be a more complex query or a call to a dedicated backend service.
// Here we just fetch all books from the mock catalog.
const getTrendingBooks = async (): Promise<Book[]> => {
    const booksCol = db.collection('catalog', 'books');
    const snapshot = await db.getDocs(booksCol);
    // Just returning the first 2 as "trending" for the mock
    // FIX: The mock db.getDocs returns an untyped promise. Cast the result to the expected shape.
    const docs = snapshot.docs as { data: () => Book }[];
    return docs.slice(0, 2).map(doc => doc.data());
};

export const useDiscoveryFeeds = () => {
    return useQuery<Book[]>({
        queryKey: ['discoveryFeeds', 'trending'],
        queryFn: getTrendingBooks,
    });
};
