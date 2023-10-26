
const axios = require('axios');
const { LIVECHAT_BOT_ID, BASE_URL_LIVECHAT } = require('./config.js');




 // Define a function to make an API request to LiveChatAI
 async function makeApiRequest(question) {
    try {
        const response = await axios.post(BASE_URL_LIVECHAT, {
            question: question,
            chatbotId: LIVECHAT_BOT_ID,
            streaming: false
        });

        const responseData = response.data;
        if (responseData && responseData.response) {
            return responseData.response;
        } else {
            return "Sorry, I couldn't generate a response at the moment.";
        }
    } catch (error) {
        console.error("Error making API request to LiveChatAI:", error.message);
        return "Sorry, something went wrong with LiveChatAI. Please try again later.";
    }
}




// Define a function to handle user requests and return the response from LiveChatAI
async function handleUserRequest(userMessage) {
    try {
        // Check if the message text is empty
        if (!userMessage) {
            return "Sorry, it's an empty message. Please send a text message.";
        }

        // Generate a response using LiveChatAI
        const response = await makeApiRequest(userMessage);

        // Return the response from LiveChatAI
        return response;
    } catch (error) {
        console.error("Error handling user message with LiveChatAI:", error.message);
        return "Sorry, something went wrong with LiveChatAI. Please try again later.";
    }
}



module.exports = {
    handleUserRequest
};
