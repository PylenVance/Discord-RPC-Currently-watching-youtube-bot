const Discord = require('discord.js');
const axios = require('axios');
const ytSearch = require('yt-search');

const client = new Discord.Client();
const TOKEN = 'YOUR_DISCORD_BOT_TOKEN';
const YT_API_KEY = 'YOUR_YOUTUBE_API_KEY';
const UPDATE_INTERVAL = 30000; // 30 seconds

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  updatePresence();
  setInterval(updatePresence, UPDATE_INTERVAL);
});

async function updatePresence() {
  try {
    const videoTitle = await getCurrentPlayingVideoTitle();
    setBotPresence(videoTitle);
  } catch (error) {
    console.error('Error updating presence:', error.message);
  }
}

async function getCurrentPlayingVideoTitle() {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet',
        chart: 'mostPopular',
        videoCategoryId: '10', // Music category
        key: YT_API_KEY,
      },
    });
    const videoTitle = response.data.items[0].snippet.title;
    return videoTitle;
  } catch (error) {
    throw error;
  }
}

function setBotPresence(videoTitle) {
  client.user.setPresence({
    activity: { name: videoTitle, type: 'WATCHING' },
  });
}

client.login(TOKEN);
