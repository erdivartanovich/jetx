# JETX a NodeJS HTTP routing library

just a tiny http server inspired by express

## Motivation

Do you ever use express.js? well, it is the most popular NodeJs framework to build web service.
This project is just a way to show how we can build a library like that, while also demonstrate how NodeJS work.
It consist of only routing system and middleware, nothing more. The routing part is run on top of my own simple eventemitter container, and it just a single-segment url pattern matching using array filtering, well that is bad, for demostration purpose, i don't want to make it complicated. NodeJS it self has already provide better eventemitter package, but i just want to show, how the concept work.

## Features

- Simple Routing
- Middleware
- Built in 404 error response

## Installation

make sure you have NodeJS (latest version is recommended) installed in your local

```sh
    $ npm install jetx
```

## Example/ how to use

- create a file for example: index.js

write these codes in the file:

```js
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
```

now run :

```sh
    node index.js
```


