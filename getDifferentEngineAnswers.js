const { handleUserRequest: handleCodyRequest } = require('./getCody.js');
const { handleUserRequest: handleLiveChatRequest } = require('./liveChat.js');
const { Client, Events, LocalAuth } = require('whatsapp-web.js');
const qrcode = require("qrcode");
const express = require('express');
const app = express();
const path = require('path');
const { PORT } = require('./config.js');

let latestQRDataUrl = null;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const client = new Client({
    puppeteer: { args: ["--no-sandbox"] },
    authStrategy: new LocalAuth({ dataPath: "./" })
});

client.on('qr', async (qr) => {
    const qrSvg = await qrcode.toDataURL(qr);
    latestQRDataUrl = qrSvg;
});

client.on(Events.MESSAGE_RECEIVED, async msg => {
    if (!msg.body) return;

    const userId = msg.from.toString();
    const userMessage = msg.body;

    // Handle user request for Cody
    const codyResponse = await handleCodyRequest(userId, userMessage);

    // Handle user request for LiveChat
    const liveChatResponse = await handleLiveChatRequest(userId, userMessage);

    // Merge responses from Cody and LiveChat
    const mergedResponse = `Cody: ${codyResponse}\n\nLiveChat: ${liveChatResponse}`;
    msg.reply(mergedResponse);
});

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
    client.initialize();
});
