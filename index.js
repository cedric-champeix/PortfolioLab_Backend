const http = require('http')

const server = http.createServer((req, res) => {
    req.statusCode = 200;
    console.log("Listening to 8080");
});
server.listen(8080);