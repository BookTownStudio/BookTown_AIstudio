

import { useQuery } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
// FIX: Add file extension to entities.ts import
import { Quote } from '../../types/entities.ts';

const getQuotes = async (uid: string): Promise<Quote[]> => {
    const quotesCol = db.collection('users', uid, 'quotes');
    const snapshot = await db.getDocs(quotesCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Quote[];
};

export const useQuotes = () => {
    const { uid } = auth.currentUser || {};
    return useQuery<Quote[]>({
        queryKey: ['userQuotes', uid],
        queryFn: () => getQuotes(uid!),
        enabled: !!uid,
    });
};
