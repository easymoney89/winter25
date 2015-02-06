var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var Gpio = require('onoff').Gpio;
var lamp = new Gpio(22, 'out');
var redled = new Gpio(17, 'out');

io.on('connection', function(socket) {

    socket.on('lamptoggle', function(data) {
        console.log(data);
        lamp.writeSync(1 - lamp.readSync());
    });

    socket.on('redledtoggle', function(data) {
        console.log(data);
        redled.writeSync(1 - redled.readSync());
    });

});

var tsl2591 = require('tsl2591');

var light = new tsl2591({
    device: '/dev/i2c-1'
});


if (light === null) {
    console.log("TSL2591 not found");
    process.exit(-1);
}

light.init({
    AGAIN: 0,
    ATIME: 1
}, function(err) {
    if (err) {
        console.log(err);
        process.exit(-2);
    } else {
        console.log('TSL2591 ready');
    }
});


var port = process.argv[2] || 8080;

app.listen(port, function() {
    console.log('Starting server on port', port);
});

function handler(req, res) {
    fs.readFile(__dirname + '/8.html',
        function(err, data) {
            res.writeHead(200);
            res.end(data);
        });
}

io.on('connection', function(socket) {
    console.log('connected');
    setInterval(function() {
        light.readLuminosity(function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
                socket.emit('light', data);
            }
        });
    }, 1000);
});