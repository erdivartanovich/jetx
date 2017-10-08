const jetx = require('./index');

const app = new jetx();
app.get('/', function(req, res) {
    res.send('hello world');
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

const mymiddleware = (req, res) => {
    console.log('middleware is working');
}
app.use(mymiddleware);
app.listen(8080);