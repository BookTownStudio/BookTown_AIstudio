
import { useQuery } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
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

export const useQuoteDetails = (quoteId: string) => {
    const { uid } = auth.currentUser || {};
    return useQuery<Quote>({
        queryKey: ['quoteDetails', uid, quoteId],
        queryFn: () => getQuote(uid!, quoteId),
        enabled: !!uid && !!quoteId,
    });
};
