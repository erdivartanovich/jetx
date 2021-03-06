var http = require('http');
var textBody = require("body");
var jsonBody = require("body/json");
var formBody = require("body/form");
var eventloop =  require("./events");

// initialize our server class
var jetx = function() {
    this.server = http.createServer();
    this.server.on('request', (req, res) => {
        // emit the route from router eventloop container
        var {url, method} = req;
        var route = this.router.emit(url, req, res, method);
        if (!route) {
            this.response(res).send(this.page404, 404, 'text/html');
        }
        // add request error handler
        req.on('error', (err) => {
            console.error('error happened: ', err.stack);
        });
    });
}

jetx.prototype.router = new eventloop();

jetx.prototype.route = function(url, callback, method='GET') {
    console.log(method, '&&')
    this.router.on(url, 
        (req, res, callback) => {
            if(['POST', 'PATCH', 'PUT'].includes(req.method)) {
                // parse the body before trigger the route callback
                callback(req, this.response(res));
            } else {
                callback(req, this.response(res));
            }
        }, 
        callback, 
        method
    );
}

jetx.prototype.page404 = '<h1>404</h1><h4>Resource not accessible, stay away!</h4>';

jetx.prototype.get = function(url, callback) {
    this.route(url, callback, 'GET');
}

jetx.prototype.post = function(url, callback) {
    this.route(url, callback, 'POST');
}

jetx.prototype.response = (res) => {
    const respObj = {
        orig: res,
        header: (keyVal) => {
                for (var key in keyVal) {
                    respObj.orig.setHeader(key, keyVal[key]);
                }
            },
        send: (content, status=200, contentType='text/html') => {
                respObj.orig.writeHead(status, {'Content-Type': contentType});
                respObj.orig.write(content);
                respObj.orig.end();
            },
        json: (content, status=200, contentType='application/json') => 
            respObj.send(JSON.stringify(content), status, contentType)
    }
    return respObj;
}

// define server listening method
jetx.prototype.listen = function(port) {
    this.server.listen(port);
    console.log('JETX server running on port: ', port);
}

// define middleware method
jetx.prototype.use = function(cb) {
    this.server.on('request', (req, res) => {
        cb(req, res);
    })
}

module.exports = jetx;

