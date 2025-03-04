const ytdl = require('ytdl-core');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const getTelegramConfig = require('./../dataFunctions/telegramConfig')

const telegramConfig = getTelegramConfig()

const TOKEN = telegramConfig.token;
const bot = new TelegramBot(TOKEN, { polling: true });
const outputFolder = telegramConfig.outputFolder;
const metadataFolder = telegramConfig.metadataFolder;

const ytdlp = require('yt-dlp-exec');
let validChatId = false;

function sanitizeString(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '-');
}

async function downloadAudio(youtubeUrl, chatId) {


    try {
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }
        if (!fs.existsSync(metadataFolder)) {
            fs.mkdirSync(metadataFolder, { recursive: true });
        }

        const videoId = new URL(youtubeUrl).searchParams.get('v');

        const metadata = await ytdlp(youtubeUrl, {
            dumpSingleJson: true,
        });
        
        console.log(metadata.title);
        
        const mp3FilePath = path.join(outputFolder, `${sanitizeString(metadata.title)}.mp3`);
        const metadataFilePath = path.join(metadataFolder, `${sanitizeString(metadata.title)}.txt`);


        fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));

        exec(`yt-dlp -x --audio-format mp3 -o "${mp3FilePath}" "${youtubeUrl}"`, (error) => {
            if (error) {
                bot.sendMessage(chatId, `Error: ${error.message}`);
            } else {
                bot.sendMessage(chatId, `Download complete! File ${metadata.title} saved to C:/music.`);
            }
        });
    } catch (error) {
        bot.sendMessage(chatId, `Error: ${error.message}`);
    }
}


function startBot() {
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const youtubeUrl = msg.text;
        telegramConfig.chatId.forEach((validId) => {
            if(validId == chatId){
                validChatId = true;
            }
        });
    
        if(validChatId){

        
        if (ytdl.validateURL(youtubeUrl)) {
            bot.sendMessage(chatId, 'Downloading audio, please wait...');
            downloadAudio(youtubeUrl, chatId);
        } else {
            bot.sendMessage(chatId, 'Invalid YouTube URL. Please send a valid link.');
        }
    }
        else{
            bot.sendMessage(chatId, `Invalid chat. Register and try again later.`);
        }
    });
}

module.exports = { startBot };