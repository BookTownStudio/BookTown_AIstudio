import { useMutation } from '../react-query.ts';
import { auth } from '../firebase.ts';

const saveVenue = async (venueId: string) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");
    
    console.log(`[Mock] User ${uid} is saving/RSVPing to venue/event ${venueId}`);
    await new Promise(res => setTimeout(res, 300));
    
    return { success: true };
};

export const useSaveVenue = () => {
    return useMutation({
        mutationFn: saveVenue,
    });
};