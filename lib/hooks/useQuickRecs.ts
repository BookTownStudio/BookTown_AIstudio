
import { useQuery } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
import { QuickRecommendations } from '../../types/entities.ts';
import { mockTrendingBookIds } from '../../data/mocks.ts';

const getQuickRecs = async (uid: string): Promise<string[]> => {
    if (uid === 'error_user') {
        // Simulate a quota error
        throw new Error("Mock Vertex quota exceeded.");
    }

    const recsRef = db.doc('recommendations_quick', uid);
    // FIX: Cast the result to the expected shape.
    const doc = await db.getDoc(recsRef) as { exists: () => boolean; data: () => QuickRecommendations };

    if (!doc.exists()) {
        throw new Error("No recommendations found.");
    }

    const data = doc.data();
    const isStale = new Date().getTime() - new Date(data.timestamp).getTime() > 6 * 60 * 60 * 1000;
    
    if (isStale) {
        throw new Error("Recommendations are stale.");
    }
    
    return data.bookIds;
};

export const useQuickRecs = () => {
    const { uid } = auth.currentUser || {};

    const { data: bookIds, isLoading, isError } = useQuery<string[]>({
        queryKey: ['quickRecs', uid],
        queryFn: () => getQuickRecs(uid!),
        enabled: !!uid,
    });

    const isFallback = isError && !isLoading;
    const finalBookIds = isFallback ? mockTrendingBookIds : bookIds;

    return {
        bookIds: finalBookIds,
        isLoading,
        isFallback,
    };
};
