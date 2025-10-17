import { useMutation, useQueryClient } from '../react-query.ts';

const likePost = async (postId: string) => {
    console.log(`[Mock] Liking post ${postId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
};

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: likePost,
        onSuccess: (data, postId) => {
            // Invalidate queries related to posts to show updated like counts
            queryClient.invalidate(['posts']);
            queryClient.invalidate(['post', postId]);
        },
    });
};