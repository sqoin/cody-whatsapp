const { Client, Events, LocalAuth } = require('whatsapp-web.js');
const qrcode = require("qrcode");
const { sendMessageToCody, fetchConversationsForBot, createConversation } = require('./api.js');

function initializeWhatsAppClient() {
    const client = new Client({
        puppeteer: { args: ["--no-sandbox"] },
        authStrategy: new LocalAuth({ dataPath: "./" })
    });

    client.on('qr', (qr) => {
        console.log('QR received.');
        qrcode.toString(qr, {
            type: "terminal",
            small: true,
            margin: 2,
            scale: 1
        }, (err, url) => {
            if (err) {
                console.error('Error generating QR code:', err);
                return;
            }
            console.log(url);
            console.log("Scan the QR code above to login to Whatsapp Web...");
        });
    });

    //... [Keep other event listeners here.]

    client.on(Events.MESSAGE_RECEIVED, async msg => {
        console.log('Message received event triggered.');
        console.log(msg.body);

        if (msg.body !== '!ping') {  // Change this condition to suit when you want to send to Cody
            console.log("not ping, I am here");
            // Step 1: Check if there's an existing conversation for that user
            const phoneNumber = msg.from; // This might need to be modified based on actual structure
            const existingConversations = await fetchConversationsForBot("");  // Replace with your actual bot ID
            let conversationId = existingConversations.find(c => c.name === phoneNumber)?.id;

            // Step 2: If not, create a new conversation (you might need a create conversation function)
            if (!conversationId) {
                conversationId = await createConversation("", phoneNumber);  // Assuming you have this function
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
    });

    return client;
}

module.exports = {
    initializeWhatsAppClient
};
