
import { useMutation, useQueryClient } from '../react-query.ts';
// FIX: Added file extension to firebase import.
import { db, auth } from '../firebase.ts';

interface ToggleBookOnShelfVars {
    shelfId: string;
    bookId: string;
}

const toggleBook = async ({ shelfId, bookId }: ToggleBookOnShelfVars) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("User not authenticated");

    const entryRef = db.doc('users', uid, 'shelves', shelfId, 'entries', bookId);
    
    // In our mock, we can use setDoc which internally calls our toggle function.
    // In a real scenario, you might check if the doc exists first.
    // Our mock toggleBookOnShelf handles both add/remove.
    await db.setDoc(entryRef, { bookId, addedAt: new Date().toISOString() }); // The data here is used by our mock
};

export const useToggleBookOnShelf = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleBook,
        onSuccess: (data, variables) => {
            // Invalidate the shelf entries query to refetch the shelf contents
            const { uid } = auth.currentUser || {};
            queryClient.invalidate(['shelfEntries', uid, variables.shelfId]);
            console.log("Mutation success, invalidating shelf entries.");
        },
    });
};