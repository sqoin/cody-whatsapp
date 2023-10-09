const { initializeWhatsAppClient } = require('./whatsapp.js');

(async function start() {
    console.log('Starting...');

    const client = initializeWhatsAppClient();
    console.log('Client initialized.');

    console.log('Initializing client...');
    await client.initialize();

    console.log('Started...');
})();

