'use strict'

const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;
const dbPath = './db.json';

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

setInterval(function () {
  fs.writeFile(dbPath, JSON.stringify(db));
}, 5000);

var server = http.createServer(function (req, res) {
    console.log('req ', req.url);

    if (req.url === '/userMsgs') {
      if (req.method === 'POST') {
        var body = [];
        req.on('data', function(chunk) {
          body.push(chunk);
        }).on('end', function() {
          body = Buffer.concat(body).toString();
          console.log('body: ', body);
          db.msgs.push({"content": body});
          // db.msgs.push(JSON.parse(body));
          // response.end();
        });
        console.log('recibido');
      }
    }

    if (req.url === '/deleteMsgs') {
      if (req.method === 'POST') {
        db.msgs = [];
        // for (var key in db.msgs) {
        //   if (db.msgs.hasOwnProperty(key)) {
        //     delete db.msgs[key];
        //   }
        // }
      }
    }


    // GET all messages
    if (req.url === '/messages') {
      if (req.method === 'GET') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(db.msgs));
      }
    }



    let filePath = 'static' + req.url;
    if (filePath === 'static/') filePath = 'static/index.html';

    var extname = String(path.extname(filePath)).toLowerCase();
    var contentType = 'text/html';
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
    };

    contentType = mimeTypes[extname] || 'application/octect-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('static/404.html', function(error, content) {
                    res.writeHead(200, {'Content-Type': contentType});
                    res.end(content, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                res.end();
            }
        } else {
            res.writeHead(200, {'Content-Type': contentType});
            res.end(content, 'utf-8');
        }
    });

}).listen(port);
console.log('Server running at http://127.0.0.1:3000/');
