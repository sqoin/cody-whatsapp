
const axios = require('axios');
const { LIVECHAT_BOT_ID, BASE_URL_LIVECHAT  } = require('./config.js');
const ChatIdModel = require('./model/chatModel'); 

async function getChatByUserId(userId) {
    try {
      // Check if a chat ID exists for the user in MongoDB
      const chatIdData = await ChatIdModel.findOne({ userId }).exec();
  
      if (chatIdData) {
        return chatIdData.chatId; // Return the existing chat ID
      } else {
        return null; // Return null if no chat ID is found
      }
    } catch (error) {
      console.error("Error getting chat ID:", error.message);
      return null; // Handle the error appropriately in your code
    }
  }
  
  async function saveChatIdAndUserId(userId, chatId) {
    try {
      // Check if a chat ID already exists for the user in MongoDB
      const existingData = await ChatIdModel.findOne({ userId }).exec();
  
      if (existingData) {
        // If data already exists, update the chat ID
        await ChatIdModel.updateOne({ userId }, { chatId });
      } else {
        // If no data exists, create a new entry with the provided chat ID and user ID
        await ChatIdModel.create({ userId, chatId });
      }
    } catch (error) {
      console.error("Error saving chat ID and user ID:", error.message);
      // Handle the error appropriately in your code
    }
  }

  
 // Define a function to make an API request to LiveChatAI
 async function sendResponseAndSaveChatID(question , userId) {
    try {
        const response = await axios.post(BASE_URL_LIVECHAT+'/reply', {
            question: question,
            chatbotId: LIVECHAT_BOT_ID,
            streaming: false
        });

        const responseData = response.data;
        if (responseData && responseData.response) {
            const chatId = responseData['chat-id'];
            console.log("new chatID:", chatId);
    
            // Save the chat ID and user ID in MongoDB
            await saveChatIdAndUserId(userId, chatId);
            return responseData.response;
        } else {
            return "Sorry, I couldn't generate a response at the moment.";
        }
    } catch (error) {
        console.error("Error making API request to LiveChatAI:", error.message);
        return "Sorry, something went wrong with LiveChatAI. Please try again later.";
    }
}



 // Define a function to make an API request to LiveChatAI
 async function sendResponse(question, chatId ) {
    try {
        console.log("old chatID:", chatId);
        const response = await axios.post(BASE_URL_LIVECHAT+'/reply', {
            question: question,
            chatbotId: LIVECHAT_BOT_ID,
            chatId:chatId,
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
async function handleUserRequest(userId,  userMessage) {
    try {
        // Check if the message text is empty
        if (!userMessage) {
            return "Sorry, it's an empty message. Please send a text message.";
        }


        let chatId = await getChatByUserId(userId);

        if (!chatId) {


            const response = await sendResponseAndSaveChatID(userMessage , userId);
            return response;
          
          } else {
            const response = await sendResponse(userMessage , chatId);

                // Return the response from LiveChatAI
                return response;
          }
        } 
      catch (error) {
        console.error("Error handling user message with LiveChatAI:", error.message);
        return "Sorry, something went wrong with LiveChatAI. Please try again later.";
    }
}



module.exports = {
    handleUserRequest
};
