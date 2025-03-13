const ytdl = require('ytdl-core');
const fs = require('fs');
var sqlFunctions = require("./sqlFunctions")
const { exec } = require('child_process');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const getTelegramConfig = require('./../dataFunctions/telegramConfig')

const telegramConfig = getTelegramConfig()

const TOKEN = telegramConfig.token;
const bot = new TelegramBot(TOKEN, { polling: true });
const outputFolder = telegramConfig.outputFolder;
const metadataFolder = telegramConfig.metadataFolder;
const tempFolder = telegramConfig.tempFolder;

const ytdlp = require('yt-dlp-exec');
let validChatId = false;

function sanitizeString(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '-');
}

async function downloadAudio(youtubeUrl, chatId) {
    try {
        if (!fs.existsSync(tempFolder)) {
            fs.mkdirSync(tempFolder, { recursive: true });
        }
        if (!fs.existsSync(metadataFolder)) {
            fs.mkdirSync(metadataFolder, { recursive: true });
        }

        const videoId = new URL(youtubeUrl).searchParams.get('v');

        const metadata = await ytdlp(youtubeUrl, {
            dumpSingleJson: true,
        });
        
        console.log(metadata.title);
        
        const mp3FilePath = path.join(tempFolder, `${sanitizeString(metadata.title)}.mp3`);
        const metadataFilePath = path.join(metadataFolder, `${sanitizeString(metadata.title)}.txt`);
        
        fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
        exec(`yt-dlp -x --audio-format mp3 -o "${mp3FilePath}" "${youtubeUrl}"`, (error) => {
            if (error) {
                bot.sendMessage(chatId, `Error: ${error.message}`);
            } else {
                bot.sendMessage(chatId, `Download complete! Sending file...`);
                bot.sendAudio(chatId, mp3FilePath).then(() => {
                    fs.unlinkSync(mp3FilePath);
                });
        fs.unlink(mp3FilePath, (unlinkError) => {
                    if (unlinkError) {
                        console.error("Error deleting file:", unlinkError);
                    } else {
                        console.log("File deleted successfully:", mp3FilePath);
                    }
                });
                sqlFunctions.insertNewDownload(chatId, sanitizeString(metadata.title));
            }
        });
    } catch (error) {
        bot.sendMessage(chatId, `Error: ${error.message}`);
    }
}

async function saveAudio(youtubeUrl, chatId) {
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
                bot.sendMessage(chatId, `Download complete! File ${metadata.title} saved to ${mp3FilePath}`);
                sqlFunctions.insertNewDownload(chatId, sanitizeString(metadata.title));
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
        validChatId = false;
        telegramConfig.chatId.forEach((validId) => {
            if(validId == chatId){
                validChatId = true;
            }
        });
    
        if(validChatId){        
            if (ytdl.validateURL(youtubeUrl)) {
                bot.sendMessage(chatId, 'Downloading audio, please wait...');
                saveAudio(youtubeUrl, chatId);
            } else {
                bot.sendMessage(chatId, 'Invalid YouTube URL. Please send a valid link.');
            }
        }
        else{
            if (ytdl.validateURL(youtubeUrl)) {
                bot.sendMessage(chatId, 'Downloading audio, please wait...');
                downloadAudio(youtubeUrl, chatId);
            } else {
                bot.sendMessage(chatId, 'Invalid YouTube URL. Please send a valid link.');
            }
        }
    });
}

module.exports = { startBot };