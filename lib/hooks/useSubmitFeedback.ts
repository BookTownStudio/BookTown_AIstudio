import { useMutation } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
import { Feedback, FeedbackType } from '../../types/entities.ts';

interface SubmitFeedbackVariables {
    type: FeedbackType;
    text: string;
    email?: string;
    attachments: string[];
}

const submitFeedback = async (variables: SubmitFeedbackVariables) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");

    const newFeedback: Omit<Feedback, 'id'> = {
        userId: uid,
        timestamp: new Date().toISOString(),
        ...variables,
    };

    const feedbackColRef = db.collection('feedback');
    await db.addDoc(feedbackColRef, newFeedback);

    console.log('[Mock] Submitted feedback:', newFeedback);
    return { success: true };
};

export const useSubmitFeedback = () => {
    // For this, no invalidation is needed as we don't display submitted feedback anywhere.
    return useMutation({
        mutationFn: submitFeedback,
    });
};