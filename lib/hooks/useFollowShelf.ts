import { useMutation, useQueryClient } from '../react-query.ts';
import { auth } from '../firebase.ts';

const followShelf = async (shelfId: string) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");
    
    console.log(`[Mock] User ${uid} is following shelf ${shelfId}`);
    // In a real app, this would update Firestore or a backend service.
    await new Promise(res => setTimeout(res, 300));
    
    return { success: true, shelfId };
};

export const useFollowShelf = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: followShelf,
        onSuccess: (data) => {
            console.log(`Successfully followed shelf ${data.shelfId}`);
            // Optionally, invalidate queries that depend on followed shelves
            // For now, we don't have one, so this is just a placeholder.
            // queryClient.invalidate(['userFollowedShelves']);
        },
    });
};