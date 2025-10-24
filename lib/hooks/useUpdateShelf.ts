import { useMutation, useQueryClient } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
import { Shelf } from '../../types/entities.ts';

interface UpdateShelfVariables {
    shelfId: string;
    updates: {
        titleEn: string;
        titleAr: string;
    };
}

const updateShelf = async ({ shelfId, updates }: UpdateShelfVariables) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");

    const shelfRef = db.doc('users', uid, 'shelves', shelfId);
    
    // Mock: get existing shelf data and merge with updates
    const docSnap = await db.getDoc(shelfRef) as { exists: () => boolean; data: () => Shelf; };

    if (docSnap.exists()) {
        const existingData = docSnap.data();
        const newData = { ...existingData, ...updates };
        await db.setDoc(shelfRef, newData); // setDoc overwrites in our mock
        console.log(`[Mock] Updated shelf ${shelfId} with`, updates);
        return { success: true };
    } else {
        throw new Error("Shelf not found");
    }
};

export const useUpdateShelf = () => {
    const queryClient = useQueryClient();
    const { uid } = auth.currentUser || {};

    return useMutation({
        mutationFn: updateShelf,
        onSuccess: () => {
            queryClient.invalidate(['userShelves', uid]);
        },
    });
};
