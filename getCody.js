const { sendMessageToCody, fetchConversationsForBot, createConversation } = require('./api.js');
const { GETCODY_BOT_ID } = require('./config.js');

async function handleUserRequest(userId, userMessage) {
    const botId = GETCODY_BOT_ID;
    const existingConversations = await fetchConversationsForBot(botId);
    let conversationId = existingConversations.find(c => c.name === userId)?.id;

    if (!conversationId) {
        conversationId = await createConversation(botId, userId);
    }

    const response = await sendMessageToCody(conversationId, userMessage);
    return response.data.content;
}

module.exports = {
    handleUserRequest
};
