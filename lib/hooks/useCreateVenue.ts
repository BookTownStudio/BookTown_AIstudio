import { useMutation, useQueryClient } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
import { Venue, Event } from '../../types/entities.ts';

type CreateVenueVariables = Omit<Venue, 'id' | 'ownerId'> | Omit<Event, 'id' | 'ownerId'>;

const createVenue = async (data: CreateVenueVariables) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("User not authenticated");

    const newId = `mock_${Date.now()}`;
    const newVenueOrEvent = { ...data, id: newId, ownerId: uid };

    // In a real app, you'd add this to a 'venues' collection.
    // Our mock db.setDoc will just add it to the MOCK_DATA.venues object.
    const docRef = db.doc('venues', newId);
    await db.setDoc(docRef, newVenueOrEvent);

    console.log(`[Mock] Created venue/event: ${newId}`);
    return { success: true, newItem: newVenueOrEvent };
};

export const useCreateVenue = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createVenue,
        onSuccess: () => {
            queryClient.invalidate(['venuesAndEvents']);
            console.log("Mutation success, invalidating venuesAndEvents.");
        },
    });
};