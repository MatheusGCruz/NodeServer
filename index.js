var sqlFunctions = require("./functions/sqlFunctions")

const express = require('express')
const fs = require('fs')
const cors = require('cors')

const app = express()



app.get('/videos/:filename', cors(), ( req, res)=>{
    const filename = req.params.filename;
    const filePath = "videos/"+[filename];
    if(!filename || !filePath || !filename == 'null'){
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
    const filePath = "videos/"+[filename];
    if(!filename || !filePath || !filename == 'null'){
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
    const files = fs.readdirSync('videos/');
    res.setHeader('Content-Type','application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With');
    return res.send(files);
})

app.get('/book/:bookname', cors(), ( req, res)=>{
    const book = sqlFunctions.searchBook(req.params.bookname);
    res.setHeader('Content-Type','application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With');
    return res.send(book);
})

app.get('/musicFiles', cors(), ( req, res)=>{
    const files = fs.readdirSync('music/');
    res.setHeader('Content-Type','application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With');
    return res.send(files);
})

app.get('/music/:filename', cors(), ( req, res)=>{
    const filename = req.params.filename;
    const filePath = "music/"+[filename];
    if(!filename || !filePath || !filename == 'null'){
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

app.listen(3015, ()=>{
    console.log('server started')
})