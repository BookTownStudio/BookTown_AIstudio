import { useMutation, useQueryClient } from '../react-query.ts';
import { db, auth } from '../firebase.ts';

const deleteShelf = async (shelfId: string) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");

    const shelfRef = db.doc('users', uid, 'shelves', shelfId);
    await db.deleteDoc(shelfRef);
    
    console.log(`[Mock] Deleted shelf: ${shelfId}`);
    return { success: true };
};

export const useDeleteShelf = () => {
    const queryClient = useQueryClient();
    const { uid } = auth.currentUser || {};

    return useMutation({
        mutationFn: deleteShelf,
        onSuccess: () => {
            queryClient.invalidate(['userShelves', uid]);
            console.log("Mutation success, invalidating userShelves.");
        },
    });
};