const http = require('http');
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
// const { StaticRouter } = require('react-router');

import App from '../pages/App';

http.createServer((req, res) => {
  // const context = {};

  if(req.url === '/'){
    const content = ReactDOMServer.renderToString(
      // <StaticRouter location={req.url} context={context}>
        <App/>
      // </StaticRouter>
    );

    res.writeHead(200, { 'Content-Type': "text/html; charset=utf-8" });
    res.end(`<!DOCTYPE html>
      <html>
          <head>
              <title>REACT SSR</title>
          </head>
          <body>
              <div id="root">${content}</div>
              <script src="/index.js"></script>
          </body>
      </html>`);
  } else if(req.url==="/index.js"){
    let filePath = path.join("public",req.url);
    fs.readFile(filePath,function(err,data){
        if(err){
            throw err;
        }
        // 设置请求头，访问文件类型为js文件
        res.setHeader("Content-Type", "text/js");
        res.end(data);
    })
  } else {
    res.end('')
  }


  // if (context.url) {
  //   res.writeHead(302, {
  //     Location: context.url,
  //   });
  //   res.end();
  // } else {
  //   res.write(html);
  //   res.end();
  // }
})
.listen(3000);
