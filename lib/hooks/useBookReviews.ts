import { useQuery } from '../react-query.ts';
import { db } from '../firebase.ts';
import { Review } from '../../types/entities.ts';

const getBookReviews = async (bookId: string | undefined): Promise<Review[]> => {
    if (!bookId) return [];
    
    // In a real Firestore, this would be a query like:
    // const q = query(collection(db, 'reviews'), where('bookId', '==', bookId));
    // For our mock, we get all reviews and filter client-side.
    const reviewsCol = db.collection('reviews');
    const snapshot = await db.getDocs(reviewsCol);
    
    const allReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
    
    // Filter reviews for the specific book
    return allReviews.filter(review => review.bookId === bookId)
                     .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // show newest first
};

export const useBookReviews = (bookId: string | undefined) => {
    return useQuery<Review[]>({
        queryKey: ['reviews', bookId],
        queryFn: () => getBookReviews(bookId),
        enabled: !!bookId,
    });
};
