const jetx = require('./index');

const app = new jetx();
app.get('/', function(req, res) {
    res.send(`<h1>hello world from JetX</h1>
        <p>
        This is the the index page.
        <br> This lib came with simple routing, middleware, and default 404 error page.
        <br> Go try to hit an undefined route such as, <a href="http://localhost:8080/xxx">here</a>
        </p>
    `);
});

app.get('/test', function(req, res) {
    const result = {
        id: 1,
        name: "erdi",
        xxx: "xxxxx"
    }
    res.json(result);
});

app.post('/', function(req, res) {
    res.send('this is the post response');
});

// using middleware
const mymiddleware = (req, res) => {
    console.log('incoming request', (new Date).getTime(), req.url)
}

app.use(mymiddleware);
app.listen(8080);