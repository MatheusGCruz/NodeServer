var sqlFunctions = require("./functions/sqlFunctions")
const getDataConfig = require('./dataFunctions/dataConfig')
const { dataAccess } = require('./dataFunctions/dataAccess')
const { startBot } = require('./functions/telegramBot');
const {recognizeText} = require('./functions/ocrFunctions');
const {downloadAudio, getTitle} = require('./functions/youtube')
const {clearDownloadDirectory, clearMetadataDirectory} = require('./functions/directoryClean')

const express = require('express')
const fs = require('fs')
const cors = require('cors')
const path = require('path');


const app = express()

const dataConfig = getDataConfig()

app.locals.db = {
    vbook: dataAccess(dataConfig.vbook)
}



app.get('/videos/:filename', cors(), ( req, res)=>{
    const filename = req.params.filename;
    const filePath = "E:/Videos/"+[filename];
    if(!filename || !filePath || filename == 'null'){
        return res.status(404).send('Not Found')
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if(range){
        const parts = range.replace(/bytes=/,'').split('-')
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10): fileSize - 1;

        const chunkSize = end - start +1;
        const file = fs.createReadStream(filePath, {start, end});
        const head = {
            'Content-Range': 'bytes '+start+'-'+end+'/'+fileSize,
            'Accept-Ranges': 'bytes',
            'Content-Length':chunkSize,
            'Content-Type':'video/mp4'
        }
        res.writeHead(206, head);
        file.pipe(res);
    }
    else{
        const head = {
            'Content-Length':fileSize,
            'Content-Type':'video/mp4'
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
})

app.get('/mkv-videos/:filename', cors(), ( req, res)=>{
    const filename = req.params.filename;
    const filePath = "E:/Videos/"+[filename];
    if(!filename || !filePath || filename == 'null'){
        return res.status(404).send('Not Found')
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if(range){
        const parts = range.replace(/bytes=/,'').split('-')
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10): fileSize - 1;

        const chunkSize = end - start +1;
        const file = fs.createReadStream(filePath, {start, end});
        const head = {
            'Content-Range': 'bytes '+start+'-'+end+'/'+fileSize,
            'Accept-Ranges': 'bytes',
            'Content-Length':chunkSize,
            'Content-Type':'video/x-matroska'
        }
        res.writeHead(206, head);
        file.pipe(res);
    }
    else{
        const head = {
            'Content-Length':fileSize,
            'Content-Type':'video/mp4'
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
})

app.get('/videoFiles', cors(), ( req, res)=>{
    const files = fs.readdirSync('E:/Videos/');
    res.setHeader('Content-Type','application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With');
    return res.send(files);
})

app.get('/bookList', cors(), async ( req, res)=>{
    const book = await sqlFunctions.searchBookList(req);
    res.setHeader('Content-Type','application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With');
    
    return res.send(book);
})

app.get('/book/:bookname', cors(), async ( req, res)=>{
    const book = await sqlFunctions.searchBook(req);
    res.setHeader('Content-Type','application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With');
    
    return res.send(book);
})

app.get('/cover/:bookname', cors(), async ( req, res)=>{
    const cover = await sqlFunctions.searchCover(req);
    res.setHeader('Content-Type','application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With');
   
    return res.send(cover);
})

app.get('/fullName/:bookname', cors(), async ( req, res)=>{
    const fullName = await sqlFunctions.searchFullName(req);
    res.setHeader('Content-Type','application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With');
   
    return res.send(fullName);
})

app.get('/style/:bookname', cors(), async ( req, res)=>{
    const style = await sqlFunctions.searchStyle(req);
    res.setHeader('Content-Type','application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With');
   
    return res.send(style);
})

app.get('/musicFiles', cors(), ( req, res)=>{
    const files = fs.readdirSync('E:/Music/');
    res.setHeader('Content-Type','application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With');
    return res.send(files);
})

app.get('/music/:filename', cors(), ( req, res)=>{
    const filename = req.params.filename;
    const filePath = "E:/Music/"+[filename];
    if(!filename || !filePath || filename == 'null'){
        return res.status(404).send('Not Found')
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if(range){
        const parts = range.replace(/bytes=/,'').split('-')
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10): fileSize - 1;

        const chunkSize = end - start +1;
        const file = fs.createReadStream(filePath, {start, end});
        const head = {
            'Content-Range': 'bytes '+start+'-'+end+'/'+fileSize,
            'Accept-Ranges': 'bytes',
            'Content-Length':chunkSize,
            'Content-Type':'audio/mpeg3'
        }
        res.writeHead(206, head);
        file.pipe(res);
    }
    else{
        const head = {
            'Content-Length':fileSize,
            'Content-Type':'audio/mpeg3'
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
})

app.get('/youtube/:videoId', cors(), async ( req, res)=>{
    const videoId = req.params.videoId;
    const title = await getTitle(videoId);
    const filePath =  await downloadAudio(videoId, title); 
    if(!videoId || !filePath || videoId == 'null'){
        return res.status(404).send('Not Found')
    }
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if(range){
        const parts = range.replace(/bytes=/,'').split('-')
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10): fileSize - 1;

        const chunkSize = end - start +1;
        const file = fs.createReadStream(filePath, {start, end});
        const head = {
            'Content-Range': 'bytes '+start+'-'+end+'/'+fileSize,
            'Accept-Ranges': 'bytes',
            'Content-Length':chunkSize,
            'Content-Type':'audio/mpeg3'
        }
        res.writeHead(206, head);
        file.pipe(res);
        // fs.unlinkSync(filePath);
    }
    else{
        const fileName = `${title}.mp3`;
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        // res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
        // fs.unlinkSync(filePath);
    }
    //fs.unlinkSync(filePath);
})

app.get('/randomMusic', cors(), ( req, res)=>{
    fs.readdir('E:/Music/', (err, files) => {
        if (err) {
          return res.status(500).send('Failed to read music folder');
        }
    
        const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');
        if (mp3Files.length === 0) {
          return res.status(404).send('No MP3 files found');
        }
    
        const filename = mp3Files[Math.floor(Math.random() * mp3Files.length)];
        const filePath = "E:/Music/"+[filename];

    if(!filename || !filePath || filename == 'null'){
        return res.status(404).send('Not Found')
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if(range){
        const parts = range.replace(/bytes=/,'').split('-')
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10): fileSize - 1;

        const chunkSize = end - start +1;
        const file = fs.createReadStream(filePath, {start, end});
        const head = {
            'Content-Range': 'bytes '+start+'-'+end+'/'+fileSize,
            'Accept-Ranges': 'bytes',
            'Content-Length':chunkSize,
            'Content-Type':'audio/mpeg3'
        }
        res.writeHead(206, head);
        file.pipe(res);
    }
    else{
        const head = {
            'Content-Length':fileSize,
            'Content-Type':'audio/mpeg3'
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
})




;

})

app.listen(3015, ()=>{

    console.log('server started');
    clearDownloadDirectory();
    clearMetadataDirectory();
    startBot();
    //recognizeText();
    console.log('bot started');
})