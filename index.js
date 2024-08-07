const express = require('express')
const fs = require('fs')

const app = express()

const videoFileMap ={
    'chacara':'videos/chacara.mp4',
    'teste':'videos/teste.mp4',
    'cachorros':'videos/cachorros.mp4',
    'isekai':'videos/isekai.mkv'
    ,'isekaimp4':'Isekai Suicide Squad - 05 (BS11 1920x1080 x264 AAC).mp4'
}

app.get('/videos/:filename', ( req, res)=>{
    const filename = req.params.filename;
    const filePath = "videos/"+[filename];
    if(!filePath){
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

app.get('/mkv-videos/:filename', ( req, res)=>{
    const filename = req.params.filename;
    const filePath = "videos/"+[filename];
    if(!filePath){
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

app.get('/files', ( req, res)=>{
    const head = {
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':'X-Requested-With'
    };

    const files = fs.readdirSync('videos/');

    // search through the files

    res.setHeader('Content-Type','application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With');
    return res.send(files);
})

app.listen(3005, ()=>{
    console.log('server started')
})