const fetch = require('node-fetch');
const { BASE_URL_GETCODY, ACCESS_TOKEN } = require('./config.js');

async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL_GETCODY}/${endpoint}`, options);

    if (!response.ok) {
        throw new Error(`API responded with ${response.status}: ${response.statusText} for endpoint: ${endpoint}`);
    }

    return await response.json();
}

module.exports = {
    fetchBots: () => apiCall('bots'),
    createConversation: async (botId, name) => {
        const jsonResponse = await apiCall('conversations', 'POST', { name, bot_id: botId });
        return jsonResponse.data.id;  // Return only the ID of the created conversation
    },
    sendMessage: (content, conversationId) => apiCall('messages', 'POST', { content, conversation_id: conversationId }),
    fetchMessages: () => apiCall('messages'),
    fetchConversationsForBot: async (botId) => {
        const data = await apiCall('conversations');
        return data.data.filter(conversation => conversation.bot_id === botId);
    },
    deleteConversation: async (conversationId) => {
        if (!conversationId) {
            throw new Error("Conversation ID is required.");
        }
        return await apiCall(`conversations/${conversationId}`, 'DELETE');
    },
    sendMessageToCody: async (conversationId, content) => {
        const response = await fetch('https://getcody.ai/api/v1/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: content,
                conversation_id: conversationId
            })
        });

        if (!response.ok) {
            throw new Error(`Cody API responded with ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }
};
