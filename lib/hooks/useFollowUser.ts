import { useMutation } from '../react-query.ts';
import { auth } from '../firebase.ts';

const followUser = async (userIdToFollow: string) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");
    console.log(`[Mock] User ${uid} is following user ${userIdToFollow}`);
    await new Promise(res => setTimeout(res, 300));
    return { success: true };
};

export const useFollowUser = () => {
    return useMutation({
        mutationFn: followUser,
        onSuccess: (data, userId) => {
            console.log(`Successfully followed user ${userId}`);
            // In a real app, you might invalidate queries related to follower counts or user relationships.
        },
    });
};
