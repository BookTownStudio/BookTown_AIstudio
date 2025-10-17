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