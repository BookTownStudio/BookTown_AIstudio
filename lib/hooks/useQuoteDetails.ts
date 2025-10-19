import { useQuery } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
// FIX: Add file extension to entities.ts import
import { Quote } from '../../types/entities.ts';

const getQuote = async (uid: string, quoteId: string): Promise<Quote> => {
    const quoteRef = db.doc('users', uid, 'quotes', quoteId);
    // FIX: Cast the result to the expected shape.
    const doc = await db.getDoc(quoteRef) as { exists: () => boolean; data: () => Omit<Quote, 'id'> };
    if (doc.exists()) {
        return { id: quoteId, ...doc.data() };
    }
    throw new Error('Quote not found');
};

export const useQuoteDetails = (quoteId: string, ownerId?: string) => {
    const { uid: loggedInUid } = auth.currentUser || {};
    const finalUid = ownerId || loggedInUid;
    return useQuery<Quote>({
        queryKey: ['quoteDetails', finalUid, quoteId],
        queryFn: () => getQuote(finalUid!, quoteId),
        enabled: !!finalUid && !!quoteId,
    });
};
