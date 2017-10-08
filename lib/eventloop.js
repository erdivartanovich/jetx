const Eventloop = function() {
    this.container = [];
}

Eventloop.prototype.on = function(evName, handler, callback, ...args) {
    this.container.push({evName, handler, callback, args});
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
        // check event is is exist with recorgnize by name and args similiarty
        return ev.evName === evName && argsEqual(ev.args, args);
    });
    if (event && event.length>0) {
        event[0].handler(req, res, event[0].callback);
        return event[0];
    } 
}

module.exports = Eventloop;