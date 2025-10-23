import { useQuery } from '../react-query.ts';
import { Venue, Event } from '../../types/entities.ts';
import { mockVenuesAndEvents } from '../../data/mocks.ts';

const getVenuesAndEvents = async (query: string): Promise<(Venue | Event)[]> => {
    await new Promise(res => setTimeout(res, 200));
    
    if (!query) {
        return mockVenuesAndEvents;
    }

    const lowerQuery = query.toLowerCase();
    return mockVenuesAndEvents.filter(item => {
        if ('name' in item) { // It's a Venue
            return item.name.toLowerCase().includes(lowerQuery) || item.type.toLowerCase().includes(lowerQuery);
        } else { // It's an Event
            return item.titleEn.toLowerCase().includes(lowerQuery) || item.titleAr.toLowerCase().includes(lowerQuery) || item.type.toLowerCase().includes(lowerQuery);
        }
    });
};

export const useVenuesAndEvents = (query: string) => {
    return useQuery<(Venue | Event)[]>({
        queryKey: ['venuesAndEvents', query],
        queryFn: () => getVenuesAndEvents(query),
    });
};