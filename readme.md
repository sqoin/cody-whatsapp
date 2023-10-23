
## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Run](#run)
4. [Test](#test)

## Installation
To set up the whatsup Bot, follow these steps:

1. Clone this repository to your local machine.
3. Install project dependencies using 
   ```
   npm install
   
   ```

## Configuration
Configure the bot by editing the config.js file:

1. ACCESS_TOKEN: Your access token for the GetCody.ai API.
2. BOT_ID: Your bot's ID from GetCody.ai (yopu can get your bot id using the following api https://getcody.ai/api/v1/conversations).

## Run
Start the whatsup Bot with the following command:  
```
 node index.js 

 ```
   

## Test

You can test this application by running the following api link in your browser:
```
http://localhost:3004/displayQRCode

```

That should give you qrcode . Once you scan it the bot will be connected to your whatsup. The bot handles incoming messages and answer them based on specific knowldege.