import { useQuery } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
import { Bookmark } from '../../types/entities.ts';

const getBookmarks = async (uid: string): Promise<Bookmark[]> => {
    const bookmarksCol = db.collection('users', uid, 'bookmarks');
    const snapshot = await db.getDocs(bookmarksCol);
    const bookmarks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Bookmark[];
    // Sort by most recent
    return bookmarks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const useBookmarks = () => {
    const { uid } = auth.currentUser || {};
    return useQuery<Bookmark[]>({
        queryKey: ['bookmarks', uid],
        queryFn: () => getBookmarks(uid!),
        enabled: !!uid,
    });
};
