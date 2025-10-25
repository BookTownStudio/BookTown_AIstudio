import { useQuery, useMutation, useQueryClient } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
import { Conversation, DirectMessage } from '../../types/entities.ts';

// Get all conversations for the current user
const getConversations = async (uid: string): Promise<Conversation[]> => {
    // In a real app, you'd query where participants array contains uid
    const snapshot = await db.getDocs(db.collection('conversations'));
    const allConversations = snapshot.docs.map(doc => doc.data()) as Conversation[];
    // For mock, just return all of them, sorted by timestamp
    return allConversations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const useConversations = () => {
    const { uid } = auth.currentUser || {};
    return useQuery<Conversation[]>({
        queryKey: ['conversations', uid],
        queryFn: () => getConversations(uid!),
        enabled: !!uid,
    });
};

// Get message history for a single conversation
const getChatHistory = async (conversationId: string): Promise<DirectMessage[]> => {
    const messagesCol = db.collection('messages', conversationId);
    const snapshot = await db.getDocs(messagesCol);
    const messages = snapshot.docs.map(doc => doc.data()) as DirectMessage[];
    return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const useChatHistory = (conversationId: string | undefined) => {
    return useQuery<DirectMessage[]>({
        queryKey: ['messages', conversationId],
        queryFn: () => getChatHistory(conversationId!),
        enabled: !!conversationId,
    });
};

// Send a message
const sendMessage = async ({ conversationId, text }: { conversationId: string, text: string }) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");
    
    console.log(`[Mock SendMessage] To convo ${conversationId}: "${text}"`);
    // Mock: in a real app, you'd add this to the messages subcollection
    // and update the lastMessage on the conversation document.
    await new Promise(res => setTimeout(res, 300));
    return { success: true };
};

export const useSendMessage = (conversationId: string | undefined) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (text: string) => sendMessage({ conversationId: conversationId!, text }),
        onSuccess: () => {
            // Invalidate to refetch messages and show the new one
            queryClient.invalidate(['messages', conversationId]);
            queryClient.invalidate(['conversations']);
        },
    });
};