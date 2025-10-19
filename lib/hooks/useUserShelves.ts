import { useQuery } from '../react-query.ts';
// FIX: Added file extensions to imports.
import { db, auth } from '../firebase.ts';
// FIX: Add file extension to entities.ts import
import { Shelf, ShelfEntry } from '../../types/entities.ts';

const getShelves = async (uid: string): Promise<Shelf[]> => {
    const shelvesCol = db.collection('users', uid, 'shelves');
    const snapshot = await db.getDocs(shelvesCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Shelf[];
};

export const useUserShelves = (ownerId?: string) => {
    const { uid: loggedInUid } = auth.currentUser || {};
    const finalUid = ownerId || loggedInUid;
    return useQuery<Shelf[]>({
        queryKey: ['userShelves', finalUid],
        queryFn: () => getShelves(finalUid!),
        enabled: !!finalUid,
    });
};

const getEntries = async (uid: string, shelfId: string): Promise<ShelfEntry[]> => {
    const entriesCol = db.collection('users', uid, 'shelves', shelfId, 'entries');
    const snapshot = await db.getDocs(entriesCol);
    return snapshot.docs.map(doc => doc.data()) as ShelfEntry[];
};

export const useShelfEntries = (shelfId: string | undefined, ownerId?: string) => {
    const { uid: loggedInUid } = auth.currentUser || {};
    const finalUid = ownerId || loggedInUid;
    return useQuery<ShelfEntry[]>({
        queryKey: ['shelfEntries', finalUid, shelfId],
        queryFn: () => getEntries(finalUid!, shelfId!),
        enabled: !!finalUid && !!shelfId,
    });
};
