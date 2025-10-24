import { useMutation, useQueryClient } from '../react-query.ts';
import { auth } from '../firebase.ts';

const updateAiConsent = async (consent: boolean) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");

    console.log(`[MockMutation] Setting AI consent for user ${uid} to: ${consent}`);
    // In a real app, update a 'preferences' subcollection or a field on the user doc.
    await new Promise(res => setTimeout(res, 400));
    
    return { success: true };
};

export const useUpdateAiConsent = () => {
    const queryClient = useQueryClient();
    const { uid } = auth.currentUser || {};

    return useMutation({
        mutationFn: updateAiConsent,
        onSuccess: () => {
            // Invalidate user profile/preferences to reflect the change
            queryClient.invalidate(['userProfile', uid]);
            console.log(`[MockMutation] Invalidated userProfile for user: ${uid}`);
        },
    });
};
