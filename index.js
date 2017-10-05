var http = require('http');

var jetx = function() {
    this.server = http.createServer((req, res) => {
        var url = req.url;
        var route = this.router.filter(route => (route.url === url && route.method === req.method));
        if(route && route.length>0) {
            console.log("incoming request to url: ", route[0].url);
            route[0].callback(req, this.response(res));
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write(this.page404);
            res.end();
        }
    });
}

jetx.prototype.router = [];

jetx.prototype.page404 = '<h1>404</h1><h4>Resource not accessible, stay away!</h4>';

jetx.prototype.route = function(url, callback, method='GET') {
   this.router.push({url, callback, method});
}

jetx.prototype.get = function(url, callback) {
    this.route(url, callback);
}

jetx.prototype.response = function(res) {
    return function(content, status=200, contentType='text/html') {
        res.writeHead(status, {'Content-Type': contentType});
        res.write(content);
        res.end();
    }
}

jetx.prototype.listen =  function(port) {
    this.server.listen(port);
    console.log('JETX server running on ', this.server.address().port);
}

const app = new jetx();
app.route('/', function(req, res) {
    res('hello world');
});

app.route('/test',  function(req, res) {
    res('hello');
});

app.listen(8080);

