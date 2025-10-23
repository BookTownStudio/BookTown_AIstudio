import { useQuery } from '../react-query.ts';
import { db } from '../firebase.ts';
import { VenueReview } from '../../types/entities.ts';

const getVenueReviews = async (venueId: string | undefined): Promise<VenueReview[]> => {
    if (!venueId) return [];
    
    const reviewsCol = db.collection('venueReviews', venueId);
    const snapshot = await db.getDocs(reviewsCol);
    
    if (!snapshot.docs || snapshot.docs.length === 0) {
        return [];
    }
    
    const allReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as VenueReview[];
    
    return allReviews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const useVenueReviews = (venueId: string | undefined) => {
    return useQuery<VenueReview[]>({
        queryKey: ['venueReviews', venueId],
        queryFn: () => getVenueReviews(venueId),
        enabled: !!venueId,
    });
};