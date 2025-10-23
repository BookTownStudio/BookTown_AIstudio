import { useMutation } from '../react-query.ts';

const likeBook = async (bookId: string) => {
    console.log(`[Mock] Liking book ${bookId}`);
    await new Promise(res => setTimeout(res, 300));
    return { success: true };
};

export const useLikeBook = () => {
    return useMutation({
        mutationFn: likeBook,
    });
};

const addReaction = async ({ entityId, reaction }: { entityId: string; reaction: string }) => {
    console.log(`[Mock] Adding reaction '${reaction}' to entity ${entityId}`);
    await new Promise(res => setTimeout(res, 300));
    return { success: true };
};

export const useAddReaction = () => {
    return useMutation({
        mutationFn: addReaction,
    });
};
