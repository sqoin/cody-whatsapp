const mongoose = require('mongoose');
const { PASSWORD, USERNAME , CLUSTER , DBNAME } = require('../config.js');
// Define your MongoDB connection URL
const MONGODB_URI = "mongodb+srv://" + USERNAME + ":" + PASSWORD + "@" + CLUSTER + ".mongodb.net/" + DBNAME;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a MongoDB schema for storing chat ID and user ID
const chatIdSchema = new mongoose.Schema({
  userId: String,
  chatId: String,
});

// Create a MongoDB model for the chat ID and user ID
const ChatIdModel = mongoose.model('ChatId', chatIdSchema);
module.exports = ChatIdModel;