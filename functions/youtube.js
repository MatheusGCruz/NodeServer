const ytdl = require('ytdl-core');
const fs = require('fs');
var sqlFunctions = require("./sqlFunctions")
const { exec } = require('child_process');
const { promisify } = require('util');

const path = require('path');
const getTelegramConfig = require('./../dataFunctions/telegramConfig')

const telegramConfig = getTelegramConfig()

const metadataFolder = telegramConfig.metadataFolder;
const tempFolder = telegramConfig.tempFolder;

const ytdlp = require('yt-dlp-exec');

function sanitizeString(str) {
    return str.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, '-');
}

async function downloadAudio(videoId) {
    var mp3FilePath = 'null';
    try {
        const youtubeUrl = "https://www.youtube.com/watch?v="+videoId;
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
        
        mp3FilePath = path.join(tempFolder, `${sanitizeString(metadata.title)}.mp3`);
        console.log(mp3FilePath);
        const metadataFilePath = path.join(metadataFolder, `${sanitizeString(metadata.title)}.txt`);
        console.log(metadataFilePath);
        
        fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
        console.log("writeFile");
        const execAsync = promisify(exec);
        await execAsync(`yt-dlp -x --audio-format mp3 -o "${mp3FilePath}" "${youtubeUrl}"`, (error) => {
            if (error) {
                console.log("if error - "+ error);
   
            } else {
                sqlFunctions.insertNewDownload("directDownload", sanitizeString(metadata.title));
                console.log("Filepath:"+mp3FilePath.toString());
            }
        });
        console.log("exec");
    } catch (error) {
        console.log("Catch error -"+error);
        return 'null';
    }finally{
        return mp3FilePath;
    }
}


module.exports = { downloadAudio };