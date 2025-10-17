
// This is a placeholder hook for a feature that is not fully implemented.
import { useQuery } from '../react-query.ts';

const getAnalytics = async () => {
    await new Promise(res => setTimeout(res, 800));
    return {
        clicks: 1042,
        conversions: 89,
        earnings: 124.60,
    };
};

export const usePartnerAnalytics = () => {
    return useQuery({
        queryKey: ['partnerAnalytics'],
        queryFn: getAnalytics,
    });
};
