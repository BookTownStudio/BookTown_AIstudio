
import { useQuery } from '../react-query.ts';
// FIX: Added file extensions to imports.
import { db, auth } from '../firebase.ts';
import { Shelf, ShelfEntry } from '../../types/entities.ts';

const getShelves = async (uid: string): Promise<Shelf[]> => {
    const shelvesCol = db.collection('users', uid, 'shelves');
    const snapshot = await db.getDocs(shelvesCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Shelf[];
};

export const useUserShelves = () => {
    const { uid } = auth.currentUser || {};
    return useQuery<Shelf[]>({
        queryKey: ['userShelves', uid],
        queryFn: () => getShelves(uid!),
        enabled: !!uid,
    });
};

const getEntries = async (uid: string, shelfId: string): Promise<ShelfEntry[]> => {
    const entriesCol = db.collection('users', uid, 'shelves', shelfId, 'entries');
    const snapshot = await db.getDocs(entriesCol);
    return snapshot.docs.map(doc => doc.data()) as ShelfEntry[];
};

export const useShelfEntries = (shelfId: string | undefined) => {
    const { uid } = auth.currentUser || {};
    return useQuery<ShelfEntry[]>({
        queryKey: ['shelfEntries', uid, shelfId],
        queryFn: () => getEntries(uid!, shelfId!),
        enabled: !!uid && !!shelfId,
    });
};
