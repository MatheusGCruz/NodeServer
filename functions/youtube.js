const ytdl = require('ytdl-core');
const fs = require('fs');
var sqlFunctions = require("./sqlFunctions")
const { exec } = require('child_process');
const path = require('path');

const metadataFolder = telegramConfig.metadataFolder;
const tempFolder = telegramConfig.tempFolder;

const ytdlp = require('yt-dlp-exec');

function sanitizeString(str) {
    return str.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, '-');
}

async function downloadAudio(youtubeUrl) {
    try {
        if (!fs.existsSync(tempFolder)) {
            fs.mkdirSync(tempFolder, { recursive: true });
        }
        if (!fs.existsSync(metadataFolder)) {
            fs.mkdirSync(metadataFolder, { recursive: true });
        }

        const metadata = await ytdlp(youtubeUrl, {
            dumpSingleJson: true,
        });
        
        console.log(metadata.title);
        
        const mp3FilePath = path.join(tempFolder, `${sanitizeString(metadata.title)}.mp3`);
        const metadataFilePath = path.join(metadataFolder, `${sanitizeString(metadata.title)}.txt`);
        
        fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
        exec(`yt-dlp -x --audio-format mp3 -o "${mp3FilePath}" "${youtubeUrl}"`, (error) => {
            if (error) {
                return 'null';
                
            } else {
                sqlFunctions.insertNewDownload("directDownload", sanitizeString(metadata.title));
                return mp3FilePath;
            }
        });
    } catch (error) {
        return 'null';
    }
}


module.exports = { downloadAudio };