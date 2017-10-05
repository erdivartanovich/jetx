var http = require('http');

// initialize our server class
var jetx = function() {
    this.server = http.createServer((req, res) => {
        var url = req.url;
        //filter url from our router list
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
    console.log('JETX server running on ', this.server.address().port);
}

const app = new jetx();
app.route('/', 'GET', function(req, res) {
    res('hello world');
});

app.get('/test',  function(req, res) {
    res('this is the test response with get method');
});

app.post('/',  function(req, res) {
    res('this is the post response');
});

app.listen(8080);

