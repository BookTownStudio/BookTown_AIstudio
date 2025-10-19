

import { useMutation, useQueryClient } from '../react-query.ts';
import { auth } from '../firebase.ts';
// FIX: Add file extension to entities.ts import
import { User } from '../../types/entities.ts';

// The variables for the mutation will be a partial User object
type UpdateProfileVariables = Partial<Pick<User, 'name' | 'handle' | 'bioEn' | 'bioAr' | 'avatarUrl' | 'bannerUrl'>>;

const updateProfile = async (updates: UpdateProfileVariables) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("User not authenticated");

    console.log('[MockMutation] Updating profile with:', updates);
    // In a real app, you would merge this with the existing document.
    // Our mock will just log it. We'll simulate a delay.
    await new Promise(res => setTimeout(res, 500));
    
    // The mock db doesn't have an update/merge function, so we'll just log.
    // The invalidation will "work" by triggering a re-fetch, but the data won't change in the mock.
    
    return { success: true, updatedData: updates };
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { uid } = auth.currentUser || {};

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            // Invalidate the user profile query to refetch the data
            if (uid) {
                queryClient.invalidate(['userProfile', uid]);
                console.log(`[MockMutation] Invalidated userProfile for user: ${uid}`);
            }
        },
    });
};
