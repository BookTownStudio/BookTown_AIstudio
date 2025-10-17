import { useMutation, useQueryClient } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
import { Review } from '../../types/entities.ts';

type ReviewVariables = {
    bookId: string;
    rating: number;
    text: string;
};

const submitReview = async ({ bookId, rating, text }: ReviewVariables) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");

    const userProfileDoc = await db.getDoc(db.doc('users', uid));
    if (!userProfileDoc.exists()) throw new Error("User profile not found");
    const userProfile = userProfileDoc.data();

    const newReview: Omit<Review, 'id'> = {
        bookId,
        userId: uid,
        rating,
        text,
        authorName: userProfile.name,
        authorHandle: userProfile.handle,
        authorAvatar: userProfile.avatarUrl,
        timestamp: new Date().toISOString(),
    };

    const reviewsColRef = db.collection('reviews');
    await db.addDoc(reviewsColRef, newReview);
    
    return { success: true };
};

export const useSubmitReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: submitReview,
        onSuccess: (data, variables) => {
            // Invalidate the reviews query for this book to show the new review
            queryClient.invalidate(['reviews', variables.bookId]);
        },
    });
};
