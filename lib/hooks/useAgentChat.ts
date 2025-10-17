
import { useQuery, useMutation, useQueryClient } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
import { ChatMessage } from '../../types/entities.ts';
import { callAgent } from '../agents-service.ts';

const getChatHistory = async (uid: string, sessionId: string): Promise<ChatMessage[]> => {
    const messagesCol = db.collection('users', uid, 'agent_sessions', sessionId, 'messages');
    const snapshot = await db.getDocs(messagesCol);
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ChatMessage[];
    // Ensure messages are sorted by timestamp
    return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

const sendMessageToAgent = async ({ uid, sessionId, agentId, messageText }: { uid: string, sessionId: string, agentId: string, messageText: string }) => {
    // 1. Save user message to Firestore
    const userMessage: Omit<ChatMessage, 'id'> = {
        role: 'user',
        text: messageText,
        timestamp: new Date().toISOString(),
    };
    const messagesColRef = db.collection('users', uid, 'agent_sessions', sessionId, 'messages');
    await db.addDoc(messagesColRef, userMessage);

    // 2. Prepare context and call the agent service
    const currentHistory = await getChatHistory(uid, sessionId); // get latest history
    const context = currentHistory.slice(-5).map(m => ({ role: m.role, text: m.text }));
    const agentResponse = await callAgent(agentId, context);
    
    // 3. Save agent response to Firestore
    const modelMessage: Omit<ChatMessage, 'id'> = {
        role: 'model',
        text: agentResponse.responseText,
        timestamp: new Date().toISOString(),
    };
    await db.addDoc(messagesColRef, modelMessage);

    return agentResponse;
};

export const useAgentChat = (agentId?: string, sessionId?: string) => {
    const { uid } = auth.currentUser || {};
    const queryClient = useQueryClient();
    
    const queryKey = ['agentChat', uid, sessionId];

    const { data: messages, isLoading, isError } = useQuery<ChatMessage[]>({
        queryKey,
        queryFn: () => getChatHistory(uid!, sessionId!),
        enabled: !!uid && !!sessionId,
    });

    const { mutate: sendMessage, isLoading: isSending } = useMutation({
        mutationFn: (messageText: string) => {
            if (!uid || !sessionId || !agentId) throw new Error("Missing chat parameters");
            return sendMessageToAgent({ uid, sessionId, agentId, messageText });
        },
        onSuccess: () => {
            // When the mutation is successful, refetch the chat history
            queryClient.invalidate(queryKey);
        },
    });

    return { messages, isLoading, isError, sendMessage, isSending };
};
