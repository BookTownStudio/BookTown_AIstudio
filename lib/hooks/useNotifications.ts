import { useQuery, useMutation, useQueryClient } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
import { Notification } from '../../types/entities.ts';

const getNotifications = async (uid: string): Promise<Notification[]> => {
    // This is a mock; in a real app, you would query a 'notifications' subcollection for the user.
    const notificationsCollection = db.collection('notifications', uid);
    const snapshot = await db.getDocs(notificationsCollection);
    
    // The mock data is already an object, but we'll simulate fetching docs
    if (!snapshot.docs) {
        // Fallback for when the collection path doesn't resolve to a docs array in the mock
        const data = (snapshot as any);
        const notifications = Object.values(data) as Notification[];
        return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notification[];
    return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const useNotifications = () => {
    const { uid } = auth.currentUser || {};
    return useQuery<Notification[]>({
        queryKey: ['notifications', uid],
        queryFn: () => getNotifications(uid!),
        enabled: !!uid,
    });
};


const markAllAsRead = async (uid: string) => {
    console.log(`[Mock] Marking all notifications as read for user ${uid}.`);
    // In a real app, this would be a batch write to update all unread notification documents.
    await new Promise(res => setTimeout(res, 300));
    return { success: true };
};

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();
    const { uid } = auth.currentUser || {};

    return useMutation({
        mutationFn: () => markAllAsRead(uid!),
        onSuccess: () => {
            // This is a mock invalidation. In a real app, you might optimistically update the UI.
            queryClient.invalidate(['notifications', uid]);
        },
    });
};