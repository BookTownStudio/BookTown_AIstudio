import { useQuery } from '../react-query.ts';
// FIX: Add file extension to entities.ts import
import { RecommendedShelf } from '../../types/entities.ts';
// FIX: Add file extension to mocks.ts import
import { mockRecommendedShelves } from '../../data/mocks.ts';

const getRecommendedShelves = async (): Promise<RecommendedShelf[]> => {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 400));
    return mockRecommendedShelves;
};

export const useRecommendedShelves = () => {
    return useQuery<RecommendedShelf[]>({
        queryKey: ['recommendedShelves'],
        queryFn: getRecommendedShelves,
    });
};
