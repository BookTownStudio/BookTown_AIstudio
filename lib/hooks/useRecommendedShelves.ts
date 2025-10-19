import { useQuery } from '../react-query.ts';
import { RecommendedShelf } from '../../types/entities.ts';
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
