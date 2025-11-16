const ytdl = require('ytdl-core');
const fs = require('fs');
var sqlFunctions = require("./sqlFunctions")
const { exec } = require('child_process');
const { promisify } = require('util');

const path = require('path');
const getTelegramConfig = require('./../dataFunctions/telegramConfig')
const execAsync = promisify(exec);

const telegramConfig = getTelegramConfig()

const metadataFolder = telegramConfig.metadataFolder;
const tempFolder = telegramConfig.tempFolder;

const ytdlp = require('yt-dlp-exec');

function sanitizeString(str) {
    return str.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/[\r\n]/g, '')             
    .replace(/["']/g, '')               
    .replace(/[<>:;?*|/\\]/g, '')       
    .replace(/[\u3000-\u303F\uFF00-\uFFEF]/g, '-') 
    .replace(/\s+/g, '-');              
}

async function getTitle(videoId){
    try{
    const youtubeUrl = "https://www.youtube.com/watch?v="+videoId;
    const metadata = await ytdlp(youtubeUrl, {
        dumpSingleJson: true,
    });    
    return sanitizeString(metadata.title);}
    catch(error){
        console.log("Title error: "+ error);
    }
}

async function downloadAudio(videoId, title) {
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
        mp3FilePath = path.join(tempFolder, `${title}.mp3`);
            try{
                fs.unlinkSync(filePath);
            }catch(error){
                console.log("file do not exists");
            }
        const metadataFilePath = path.join(metadataFolder, `${title}.txt`);      
        fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
        console.log("writeFile");

        await run(mp3FilePath, youtubeUrl);
    } catch (error) {
        console.log("Catch error -"+error);
        return 'null';
    }finally{
        return mp3FilePath;
    }
}



async function run(mp3FilePath, youtubeUrl) {
  try {
    const { stdout, stderr } = await execAsync(`yt-dlp -x --audio-format mp3 -o "${mp3FilePath}" "${youtubeUrl}"`);
    console.log("done:", stdout);
  } catch (err) {
    console.error("command failed:", err);
  }
}

module.exports = { downloadAudio , getTitle};