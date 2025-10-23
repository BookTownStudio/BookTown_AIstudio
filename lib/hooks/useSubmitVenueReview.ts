import { useMutation, useQueryClient } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
import { VenueReview } from '../../types/entities.ts';

type ReviewVariables = {
    venueId: string;
    rating: number;
    text: string;
};

const submitVenueReview = async ({ venueId, rating, text }: ReviewVariables) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");

    const userProfileDoc = await db.getDoc(db.doc('users', uid));
    if (!userProfileDoc.exists()) throw new Error("User profile not found");
    const userProfile = userProfileDoc.data();

    const newReview: Omit<VenueReview, 'id'> = {
        venueId,
        userId: uid,
        rating,
        text,
        authorName: userProfile.name,
        authorHandle: userProfile.handle,
        authorAvatar: userProfile.avatarUrl,
        timestamp: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        commentsCount: 0,
    };

    const reviewsColRef = db.collection('venueReviews', venueId);
    await db.addDoc(reviewsColRef, newReview);
    
    return { success: true };
};

export const useSubmitVenueReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: submitVenueReview,
        onSuccess: (data, variables) => {
            queryClient.invalidate(['venueReviews', variables.venueId]);
        },
    });
};