import { useMutation, useQueryClient } from '../react-query.ts';
import { db, auth } from '../firebase.ts';

interface CreateShelfVariables {
    titleEn: string;
    titleAr: string;
}

const createShelf = async ({ titleEn, titleAr }: CreateShelfVariables) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");

    const newShelfId = titleEn.toLowerCase().replace(/\s+/g, '-');
    const shelfRef = db.doc('users', uid, 'shelves', newShelfId);
    
    const newShelfData = {
        id: newShelfId,
        titleEn,
        titleAr,
        entries: {}
    };

    await db.setDoc(shelfRef, newShelfData);
    
    console.log(`[Mock] Created shelf: ${titleEn}`);
    return { success: true, newShelf: newShelfData };
};

export const useCreateShelf = () => {
    const queryClient = useQueryClient();
    const { uid } = auth.currentUser || {};

    return useMutation({
        mutationFn: createShelf,
        onSuccess: () => {
            queryClient.invalidate(['userShelves', uid]);
            console.log("Mutation success, invalidating userShelves.");
        },
    });
};
