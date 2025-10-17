// MOCK AI AGENT SERVICE
const RATE_LIMIT_COUNT = 60;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

const getTimestamps = (): number[] => {
    try {
        const item = localStorage.getItem('agent_call_timestamps');
        return item ? JSON.parse(item) : [];
    } catch {
        return [];
    }
};

const addTimestamp = (timestamps: number[]) => {
    const now = Date.now();
    localStorage.setItem('agent_call_timestamps', JSON.stringify([...timestamps, now]));
};

const getMockResponse = (agentId: string, lastMessage: string): string => {
    switch (agentId) {
        case 'mentor':
            return "That's a great start! Have you considered raising the stakes for the protagonist in that scene?";
        case 'librarian':
            return `Based on your interest in "${lastMessage}", I recommend "Children of Time" by Adrian Tchaikovsky. It's a fantastic space opera.`;
        case 'quotes':
            return `One powerful quote from that book is: "We are all storytellers. We live in a sea of stories, and we swim in them, and we float in them, and we drown in them."`;
        default:
            return "I'm not sure how to help with that. Can you try rephrasing?";
    }
};


export const callAgent = async (agentId: string, contextMessages: { role: string; text: string }[]) => {
    console.log('[AgentService] Calling agent with context:', contextMessages);

    // 1. Security Simulation
    const mockAuthToken = 'mock_auth_token_123';
    const mockAppCheckToken = 'mock_app_check_token_xyz';

    if (!mockAuthToken || !mockAppCheckToken) {
        throw new Error("Security validation failed.");
    }

    // 2. Rate Limit Simulation
    const now = Date.now();
    const timestamps = getTimestamps();
    const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);

    if (recentTimestamps.length >= RATE_LIMIT_COUNT) {
        console.warn('[AgentService] Rate limit exceeded.');
        throw new Error("You've made too many requests. Please try again in an hour.");
    }
    addTimestamp(recentTimestamps);

    // 3. Latency Simulation & Logging
    const startTime = performance.now();
    const latency = 500 + Math.random() * 500; // 500-1000ms
    await new Promise(res => setTimeout(res, latency));

    const endTime = performance.now();
    console.log(`[AgentService] Mock call took ${Math.round(endTime - startTime)}ms.`);

    const lastUserMessage = contextMessages.filter(m => m.role === 'user').pop()?.text || "";
    
    // 4. Return Mock Response
    return {
        responseText: getMockResponse(agentId, lastUserMessage),
    };
};
