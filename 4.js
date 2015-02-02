var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var Gpio = require('onoff').Gpio,
    button = new Gpio(18, 'in', 'both');

function exit() {
    button.unexport();
    process.exit();
}

process.on('SIGINT', exit);

var port = process.argv[2];
app.listen(port);

function handler(req, res) {
    fs.readFile(__dirname + '/4.html',
        function(err, data) {
            res.writeHead(200);
            res.end(data);
        });
}



io.on('connection', function(socket) {

    socket.on('clicked', function (data) {
        console.log(data);
    });

    button.watch(function(err, value) {
        if (err) exit();
        console.log('button', value);
        socket.volatile.emit('button', {
            status: value
        });

    });

    setInterval(function() {
        var d = new Date();
        var n = d.getTime();
        socket.volatile.emit('date', {
            date: d,
            milliseconds: n
        });
    }, 500);
});
