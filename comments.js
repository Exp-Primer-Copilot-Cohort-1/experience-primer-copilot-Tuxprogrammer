// Create a web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const app = http.createServer(function(request,response){
    var _url = request.url;
    // console.log(_url);
    var queryData = url.parse(_url, true).query;
    // console.log(queryData.id);
    var pathname = url.parse(_url, true).pathname;
    // console.log(pathname);
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          // var list = templateList(filelist);
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          // response.writeHead(200);
          // response.end(html);
          response.writeHead(200, {'Content-Type':'text/html'});
          response.end(html);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            // var list = templateList(filelist);
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            // response.writeHead(200);
            // response.end(html);
            response.writeHead(200, {'Content-Type':'text/html'});
            response.end(html);
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        // var list = templateList(filelist);
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
        // response.writeHead(200);
        // response.end(html);
        response.writeHead(200, {'Content-Type':'text/html'});
        response.end(html);
      });
    }
});