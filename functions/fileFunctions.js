const ytdl = require('ytdl-core');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

async function downloadAudio(youtubeUrl, outputFolder = 'downloads') {
    try {
        // Create output folder if it doesn't exist
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }
        
        const videoId = ytdl.getURLVideoID(youtubeUrl);
        const outputFilePath = path.join(outputFolder, `${videoId}.mp4`);
        const mp3FilePath = path.join(outputFolder, `${videoId}.mp3`);
        
        // Download audio
        const audioStream = ytdl(youtubeUrl, { quality: 'highestaudio' });
        const writeStream = fs.createWriteStream(outputFilePath);
        audioStream.pipe(writeStream);
        
        writeStream.on('finish', () => {
            // Convert to MP3 using FFmpeg
            exec(`ffmpeg -i "${outputFilePath}" -q:a 0 -map a "${mp3FilePath}" -y`, (error) => {
                if (error) {
                    console.error(`Error converting to MP3: ${error.message}`);
                } else {
                    console.log(`Download complete: ${mp3FilePath}`);
                    fs.unlinkSync(outputFilePath); // Remove original file
                }
            });
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// Run script
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Enter YouTube link: ', (youtubeLink) => {
    downloadAudio(youtubeLink);
    readline.close();
});
