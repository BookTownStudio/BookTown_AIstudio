import { useMutation, useQueryClient } from '../react-query.ts';
import { auth } from '../firebase.ts';

const saveQuote = async (quoteId: string) => {
    console.log(`[Mock] Saving quote ${quoteId}`);
    // In a real app, this would add the quote to the user's collection.
    await new Promise(res => setTimeout(res, 300));
    return { success: true };
};

export const useSaveQuote = () => {
    const queryClient = useQueryClient();
    const { uid } = auth.currentUser || {};
    return useMutation({
        mutationFn: saveQuote,
        onSuccess: () => {
            // Invalidate the user's quotes list so it would refetch if they navigate there.
            queryClient.invalidate(['userQuotes', uid]);
        }
    });
};

const saveBookmark = async (entityId: string) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");
    
    console.log(`[Mock] User ${uid} is bookmarking entity ${entityId}`);
    await new Promise(res => setTimeout(res, 300));
    
    return { success: true };
};

export const useSaveBookmark = () => {
    const queryClient = useQueryClient();
    const { uid } = auth.currentUser || {};
    
    return useMutation({
        mutationFn: saveBookmark,
        onSuccess: () => {
            // Invalidate a general bookmarks query
            queryClient.invalidate(['bookmarks', uid]);
        }
    });
};
