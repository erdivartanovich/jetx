const UrlPattern = require('url-pattern');

const Eventloop = function() {
    this.container = [];
    this.pattern = [];
}

Eventloop.prototype.on = function(evName, handler, callback, ...args) {
    // create the regexp pattern and push it alonside the event name in the container
    var pattern = new UrlPattern(evName);
    this.container.push({evName, pattern, handler, callback, args});
}

Eventloop.prototype.emit =  function(evName, req, res, ...args) {
    const event = this.container.filter((ev) => {
        // function to check args similiarty
        function argsEqual(args1, args2) {
            if(args1.length !== args2.length)
                return false;
            for(var i = args1.length; i--;) {
                if(args1[i] !== args2[i])
                    return false;
            }
                return true;
        }
        // check if event is exist, recognized by pattern matching by the given evName vs the registered pattern, and the http method similiarty
        var match = ev.pattern.match(evName);
        return (Boolean(match) && argsEqual(ev.args, args) );
    });
    console.log(event[0])
    if (event && event.length>0) {
        // store the request url input/segment value
        req.input = event[0].pattern.match(evName);

        event[0].handler(req, res, event[0].callback);
        return event[0];
    } 
}

module.exports = Eventloop;