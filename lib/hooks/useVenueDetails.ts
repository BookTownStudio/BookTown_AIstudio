import { useQuery } from '../react-query.ts';
import { db } from '../firebase.ts';
import { Venue, Event } from '../../types/entities.ts';

type VenueOrEvent = Venue | Event;

const getVenue = async (venueId: string | undefined): Promise<VenueOrEvent> => {
    if (!venueId) {
        throw new Error("Venue ID is required.");
    }
    const docRef = db.doc('venues', venueId);
    const docSnap = await db.getDoc(docRef) as { exists: () => boolean; data: () => VenueOrEvent; };

    if (docSnap.exists()) {
        const data = docSnap.data();
        return { ...data, id: venueId };
    } else {
        throw new Error("Venue not found.");
    }
};

export const useVenueDetails = (venueId: string | undefined) => {
    return useQuery<VenueOrEvent>({
        queryKey: ['venue', venueId],
        queryFn: () => getVenue(venueId),
        enabled: !!venueId,
    });
};