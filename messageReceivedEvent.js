
   /* client.on(Events.MESSAGE_RECEIVED, async msg => {
        console.log('Message received event triggered.');
        console.log(msg.body);
        if ( ! msg.body) {
            console.error(`empty body from ${msg.from} that won't be considered `);
            return;
        }
        if (msg.body !== '!ping') {  // Change this condition to suit when you want to send to Cody
            // Step 1: Check if there's an existing conversation for that user
            const phoneNumber = msg.from; // This might need to be modified based on actual structure
            const existingConversations = await fetchConversationsForBot("mWZdPjgDzaKg");  // Replace with your actual bot ID
            let conversationId = existingConversations.find(c => c.name === phoneNumber)?.id;

            // Step 2: If not, create a new conversation (you might need a create conversation function)
            if (!conversationId) {
                conversationId = await createConversation("mWZdPjgDzaKg", phoneNumber);  // Assuming you have this function
            }
            console.log("conversation id : " + conversationId);
            // Step 3: Send the WhatsApp message to the Cody API
            const response = await sendMessageToCody(conversationId, msg.body);
            console.log("response is  " + response);
            // Step 5: Send the response from Cody back to the WhatsApp user
            msg.reply(response.data.content);
        } else {
            console.log('Ping command detected. Sending pong reply...');
            msg.reply('pong');
        }
    }); */