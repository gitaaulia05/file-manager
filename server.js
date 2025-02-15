const http = require('http');
const fs = require('fs');
const path = require('path');


const { addMetadata, getAllFiles, deleteFileMetadata } = require('./fileStore');

const uploadDir = path.join(__dirname, 'uploads');

//Menyimpan token yang valid ( BERISI TOKEN(key) DAN MASA KADALUARSA(value))
const validTokens = new Map();
// Pastikan folder "uploads" ada
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        const htmlPath = path.join(__dirname, 'index.html');
        fs.readFile(htmlPath, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error loading index.html');
                return;
            }
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
        });
     } else if(req.method === 'POST' && req.url === '/storeToken'){
        let body = '';
        req.on('data' , chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                const { token } = JSON.parse(body);
                if(!token) {
                    res.statusCode = 400;
                    res.end('Invalid token');
                    return;
                }
                    // MEMASTIKAN HANYA ADA SATU TOKEN YANG VALID 
                validTokens.clear();

                // KADALUARSA TOKEN 5 MENIT
                const expiry = Date.now() + 5 * 60 * 1000;
                validTokens.set(token , expiry);
                res.statusCode = 200;
                res.end('Token stored successfully');
            } catch(err){
                res.statusCode = 400;
                res.end('Invalid request format');
            }
        });
     } 
    else if (req.method === 'GET' && req.url === '/style.css') {
        const cssPath = path.join(__dirname, 'style.css');
        fs.readFile(cssPath, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error loading style.css');
                return;
            }
            res.setHeader('Content-Type', 'text/css');
            res.end(data);
        });
    } else if (req.method === 'POST' && req.url === '/upload') {
        const authHeader = req.headers['authorization'];
        // mengambil headers authorization (format bearer) mengambil hanya tokennya saja
        const token = authHeader.split(' ')[1];
     
        if(!token || !validTokens.has(token)) {
            res.statusCode = 401;
            res.end('Invalid or Missing Token');
            return;
        }

        const expiry = validTokens.get(token);
    if (Date.now() > expiry) {
        validTokens.delete(token); // Hapus token yang sudah expired
        res.statusCode = 401;
        res.end('Token expired');
        return;
    }

        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            const fileBuffer = Buffer.concat(body);
            const fileName = 'file_' + Date.now();
            const filePath = path.join(uploadDir, fileName);

            fs.writeFile(filePath, fileBuffer, err => {
                if (err) {
                    res.statusCode = 500;
                    res.end('Failed to upload file');
                    return;
                }

                const metadata = {
                    name: fileName,
                    size: fileBuffer.length,
                    uploadTime: new Date().toISOString()
                };
                addMetadata(metadata);

                res.statusCode = 200;
                res.end('File uploaded successfully');
            });
        });
    } else if (req.method === 'GET' && req.url === '/files') {
        // MENGAMBIL HEADER AUTHORIZATION 
        const authHeader = req.headers['authorization'];
     
        if(!authHeader) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                success: false , message : 'Acces Denied'
            }));
            return;
        }
        // mengambil headers authorization (format bearer) mengambil hanya tokennya saja
        const token = authHeader.split(' ')[1];
        console.log('token delete ' +token);

        if(!token || !validTokens.has(token)) {
            res.statusCode = 401;
            res.setHeader('Content-Type' , 'application/json');
            res.end(JSON.stringify({
                success : false,
                message : 'Invalid Token'
            }));
            return;
        
        }

        const files = getAllFiles();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify( files));

    } else if (req.method === 'POST' && req.url.startsWith('/delete/')) {
        const authHeader = req.headers['authorization'];
        console.log('authorization Header:', authHeader);

        if(!authHeader) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                success: false , message : 'Missing Auth Header'
            }));
            return;
        }

        const token = authHeader.split(' ')[1];
        console.log('token delete ' +token);

        if(!token || !validTokens.has(token)) {
            res.statusCode = 401;
            res.setHeader('Content-Type' , 'application/json');
            res.end(JSON.stringify({
                success : false,
                message : 'Invalid Token'
            }));
            return;
        
        }

        const expiry = validTokens.get(token);
    if (Date.now() > expiry) {
        validTokens.delete(token); // Hapus token yang sudah expired
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            success : false,
            message :'Token expired'
        }));
        return;
    }

        const fileName = req.url.split('/').pop();
        const filePath = path.join(uploadDir, fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            deleteFileMetadata(fileName);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                success : true,
                message : 'File deleted successfully'
            }));
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end( JSON.stringify({
                success : false,
                message : 'File not found',
            }));
        }
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});