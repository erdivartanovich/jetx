var http = require('http');
var textBody = require("body");
var jsonBody = require("body/json");
var formBody = require("body/form");

// initialize our server class
var jetx = function() {
    var logIdIterator = 0;
    
    this.server = http.createServer();
    this.server.on('request', (req) => {
        // request logger
        req.log = {
            id: ++logIdIterator
        }
        //read and store request body
        req.getBody = (cb) => {
            textBody(req, (err, body)=>{
                if(!body) {
                    jsonBody(req, (err, body) => {
                        if(!body) {
                            formBody(req, cb)
                        } else {
                            cb(err, body);
                        }
                    });
                } else {
                    cb(err, body);
                }
            });
        }
    });
    this.server.on('request', (req, res) => {
        var {url, method, headers } = req;
        //filter url from our router list
        var route = this.router.filter(route => (route.url === url && route.method === method));
        if(route && route.length>0) {
            console.log(`[${req.log.id}] `, "incoming request to url: ", route[0].url);
            if(['POST', 'PATCH', 'PUT'].includes(method)) {
                // parse the body before trigger the route callback
                req.getBody((err, body)=>{
                    if(body){
                        req.body = body;
                    }
                    route[0].callback(req, this.response(res));
                });
            } else {
                route[0].callback(req, this.response(res));
            }
        } else {
            this.send(res, this.page404);
        }
        
        // add request error handler
        req.on('error', (err) => {
            console.error('error happened: ', err.stack);
        });
    });
}

jetx.prototype.send = function(res, content) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write(content);
    res.end();
}

jetx.prototype.router = [];

jetx.prototype.page404 = '<h1>404</h1><h4>Resource not accessible, stay away!</h4>';

jetx.prototype.route = function(url, method='GET', callback) {
    this.router.push({url, method, callback});
}

jetx.prototype.get = function(url, callback) {
    this.route(url, 'GET', callback);
}

jetx.prototype.post = function(url, callback) {
    this.route(url, 'POST', callback);
}

jetx.prototype.response = (res) => 
    (content, status=200, contentType='text/html') => {
        res.writeHead(status, {'Content-Type': contentType});
        res.write(content);
        res.end();
    }

jetx.prototype.listen =  function(port) {
    this.server.listen(port);
    console.log('JETX server running on port: ', this.server.address().port);
}

const app = new jetx();
app.route('/', 'GET', function(req, res) {
    res('hello world');
});

app.get('/test', function(req, res) {
    res('this is the test response with get method');
});

app.post('/', function(req, res) {
    res('this is the post response');
});

app.listen(8080);

