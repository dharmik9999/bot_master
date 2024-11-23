const express = require('express');
const mineflayer = require('mineflayer');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = 3000;

let bot = null;

// Serve the static front-end HTML page
app.use(express.static(path.join(__dirname, 'public')));

// Route to start the bot with the provided IP
app.get('/join', (req, res) => {
  const ip = req.query.ip;
  if (!ip) {
    return res.send('No IP address provided.');
  }

  if (bot) {
    return res.send('Bot is already running.');
  }

  // Create the bot
  bot = mineflayer.createBot({
    host: ip,
    port: 28394, // or use the default server port (25565)
    username: 'bot001',
    version: '1.20'
  });

  bot.on('login', () => {
    console.log('Bot has logged in!');
  });

  bot.on('kicked', (reason) => {
    console.log('Bot was kicked:', reason);
  });

  bot.on('error', (err) => {
    console.log('Bot encountered an error:', err);
  });

  bot.on('spawn', () => {
    console.log('Bot has spawned in the world.');
  });

  res.send(`Bot has joined the server: ${ip}`);
});

// Route to stop the bot
app.get('/leave', (req, res) => {
  if (bot) {
    bot.quit();
    bot = null;
    res.send('Bot has left the server.');
  } else {
    res.send('No bot is currently running.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
