const { fetchBots, fetchConversationsForBot, deleteConversation } = require('./api');

async function deleteAllConversations() {
    try {
        // 1. Fetch all bots
        const bots = await fetchBots();

        for (const bot of bots.data) {
            console.log(`Fetching conversations for bot ID: ${bot.id}`);

            // 2. Fetch all conversations for each bot
            const conversations = await fetchConversationsForBot(bot.id);

            for (const conversation of conversations) {
                console.log(`Deleting conversation ID: ${conversation.id}`);

                // 3. Delete each conversation one by one
                await deleteConversation(conversation.id);
                console.log(`Deleted conversation ID: ${conversation.id}`);
            }
        }

        console.log('All conversations have been deleted.');

    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }
}

// Execute the function
deleteAllConversations();
