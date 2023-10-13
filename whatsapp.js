const { Client, Events, LocalAuth } = require('whatsapp-web.js');
const qrcode = require("qrcode");
const { sendMessageToCody, fetchConversationsForBot, createConversation } = require('./api.js');
const { BOT_ID } = require('./config.js');

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

    let activeChats = {};

client.on(Events.MESSAGE_RECEIVED, async msg => {
    console.log('Message received event triggered.');
    console.log(msg.body);
    if (!msg.body) {
        return;
    }
   /* if (!msg.body.startsWith("!")) {
        return;
    }*/
    if (msg.body === '!ping') {
        console.log('Ping command detected. Sending pong reply...');
        msg.reply('pong');
        return;
    }

    const phoneNumber = msg.from;

    // Initialize or update the activeChats entry for the user
    if (!activeChats[phoneNumber]) {
        activeChats[phoneNumber] = {
            messages: [],
            timeout: null
        };
    }

    activeChats[phoneNumber].messages.push(msg.body);

    // Clear any previously set timeout
    if (activeChats[phoneNumber].timeout) {
        clearTimeout(activeChats[phoneNumber].timeout);
    }

    // Set a new timeout
    activeChats[phoneNumber].timeout = setTimeout(async () => {
        const concatenatedMsg = activeChats[phoneNumber].messages.join(' ');
        
        const botId = BOT_ID;
       // const botId = "WJxboZXNkagw";
        const existingConversations = await fetchConversationsForBot(botId); // Replace with your actual bot ID
        let conversationId = existingConversations.find(c => c.name === phoneNumber)?.id;
        
        if (!conversationId) {
            conversationId = await createConversation(botId, phoneNumber); // Assuming you have this function
        }

        const response = await sendMessageToCody(conversationId, concatenatedMsg);
        msg.reply(response.data.content);

        // Clear the entry for the user
        delete activeChats[phoneNumber];

    }, 5000);  // 5 seconds
});

    return client;
}

module.exports = {
    initializeWhatsAppClient
};
