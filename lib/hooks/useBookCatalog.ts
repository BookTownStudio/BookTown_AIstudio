
import { useQuery } from '../react-query.ts';
// FIX: Added file extensions to imports.
import { db } from '../firebase.ts';
import { Book } from '../../types/entities.ts';

const getBook = async (bookId: string | undefined): Promise<Book> => {
    if (!bookId) {
        throw new Error("Book ID is required.");
    }
    const docRef = db.doc('catalog/books', bookId);
    // FIX: Cast the result to the expected shape.
    const docSnap = await db.getDoc(docRef) as { exists: () => boolean; data: () => Book; };

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        throw new Error("Book not found.");
    }
};

export const useBookCatalog = (bookId: string | undefined) => {
    return useQuery<Book>({
        queryKey: ['book', bookId],
        queryFn: () => getBook(bookId),
        enabled: !!bookId,
    });
};
