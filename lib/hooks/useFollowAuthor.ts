import { useMutation, useQueryClient } from '../react-query.ts';
import { auth } from '../firebase.ts';

const followAuthor = async (authorId: string) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");
    console.log(`[Mock] User ${uid} is following author ${authorId}`);
    await new Promise(res => setTimeout(res, 300));
    return { success: true };
};

export const useFollowAuthor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: followAuthor,
        onSuccess: (data, authorId) => {
            console.log(`Successfully followed author ${authorId}`);
            // In a real app, invalidate queries related to followed authors
            // queryClient.invalidate(['followedAuthors', auth.currentUser?.uid]);
        },
    });
};