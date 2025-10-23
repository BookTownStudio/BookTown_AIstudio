import { useMutation, useQueryClient } from '../react-query.ts';
import { db } from '../firebase.ts';
import { Venue, Event } from '../../types/entities.ts';

interface UpdateVenueVariables {
    venueId: string;
    data: Venue | Event;
}

const updateVenue = async ({ venueId, data }: UpdateVenueVariables) => {
    const docRef = db.doc('venues', venueId);
    
    // The mock setDoc replaces the entire object, which is what we want for this edit flow.
    await db.setDoc(docRef, data);

    console.log(`[Mock] Updated venue/event: ${venueId}`);
    return { success: true, updatedItem: data };
};

export const useUpdateVenue = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateVenue,
        onSuccess: (data, variables) => {
            queryClient.invalidate(['venuesAndEvents']);
            queryClient.invalidate(['venue', variables.venueId]);
            console.log("Mutation success, invalidating venuesAndEvents and venue details.");
        },
    });
};