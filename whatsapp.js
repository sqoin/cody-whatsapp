const { Client, Events, LocalAuth } = require('whatsapp-web.js');
const qrcode = require("qrcode");
const { sendMessageToCody, fetchConversationsForBot, createConversation } = require('./api.js');
const { BOT_ID , PORT } = require('./config.js');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
let latestQRDataUrl = null;
let activeChats = {};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function initializeWhatsAppClient() {


    try {
        const client = new Client({
            puppeteer: { args: ["--no-sandbox"] },
            authStrategy: new LocalAuth({ dataPath: "./" })
        });

        client.on('qr', async (qr) => {
            try {
                console.log('QR received.');

                // Generate the QR Code in the terminal as you did before
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

                // Generate QR Code as Data URL
                const qrSvg = await qrcode.toDataURL(qr);
                latestQRDataUrl = qrSvg;  // Set the data URL

                // Initialize PDF Document
                const doc = new PDFDocument;

                // Pipe the PDF into a .pdf file
                doc.pipe(fs.createWriteStream('QRCode.pdf'));

                // Add the QR Code image into the PDF
                doc.image(qrSvg, { fit: [250, 250] });

                // Finalize PDF file
                doc.end();

                console.log("QR Code has also been written to QRCode.pdf");
            } catch (qrError) {
                console.error('Error handling QR code:', qrError);
            }
        });





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
    } catch (error) {
        console.error('Error initializing WhatsApp client:', error);
    }
}


// Route to display QR code page
app.get('/displayQRCode', (req, res) => {
    if (!latestQRDataUrl) {
        return res.send("QR code hasn't been generated yet.");
    }
    res.render('qrcode', { qrDataUrl: latestQRDataUrl });
});


app.get('/latestQRDataUrl', (req, res) => {
    if (!latestQRDataUrl) {
        return res.status(200).json({ status: "not_ready" });
    }
    res.json({ status: "ready", dataUrl: latestQRDataUrl });
});



app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});



module.exports = {
    initializeWhatsAppClient
};